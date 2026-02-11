import "./MainConsultorio.css";
import ShowConsultorio from "../ShowConsultorio/ShowConsultorio";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Security/Context/AuthContext";
import { useEffect, useState, useRef } from "react";
import notLogin from "../../../../assets/images/notLogin.png";
import { listarCidadesPorUf } from "../../../../services/locationService.js";

const MainConsultorio = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [newConsultorio, setNewConsultorio] = useState([]);
    const [IsLoading, setIsLoading] = useState(true);
    const [newImage, setNewImage] = useState("");
    const [newSwitch, setNewSwitch] = useState(false);
    const [show, setShow] = useState(false);
    const [showMore, setShowMore] = useState(null);
    const [searchEstado, setSearchEstado] = useState("");
    const [searchCidade, setSearchCidade] = useState("");
    const [cidades, setCidades] = useState([]);
    const [loadingCidades, setLoadingCidades] = useState(false);
    const [Error, setError] = useState(null);

    const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    const ufToCodigo = {
        AC: 12, AL: 27, AP: 16, AM: 13, BA: 29, CE: 23, DF: 53,
        ES: 32, GO: 52, MA: 21, MT: 51, MS: 50, MG: 31, PA: 15,
        PB: 25, PR: 41, PE: 26, PI: 22, RJ: 33, RN: 24, RS: 43,
        RO: 11, RR: 14, SC: 42, SP: 35, SE: 28, TO: 17
    };

    const ToggleshowMore = (consultorioid) => {
        if (showMore === consultorioid) {
            setShowMore(null);
        } else {
            setShowMore(consultorioid);
        }
    };

    const handleUfChange = async (e) => {
        const uf = e.target.value;
        setSearchEstado(uf);
        setSearchCidade("");
        setCidades([]);

        if (uf) {
            setLoadingCidades(true);
            try {
                const cidadesList = await listarCidadesPorUf(uf);
                setCidades(Array.isArray(cidadesList) ? cidadesList : []);
            } catch (err) {
                console.error("Erro ao carregar cidades:", err);
                setCidades([]);
            }
            setLoadingCidades(false);
        }
    };

    const asyncFunction = async (estado, cidadeId) => {
        setIsLoading(true);
        setError(null);
        let url = `${apiUrl}/api/consultorio`;
        const params = [];

        if (estado && estado.trim() !== "") {
            const codigoEstado = ufToCodigo[estado];
            params.push(`estado=${codigoEstado}&`);
        }
        if (cidadeId && cidadeId.toString().trim() !== "") {
            params.push(`cidade_id=${cidadeId}`);
        }

        try {
            const response = await axios.get(url);
            
            const consultorios = response.data?.content || response.data || [];
            
            if (consultorios.length === 0) {
                if (cidadeId) {
                    const cidadeObj = cidades.find(c => String(c.idIbge) === String(cidadeId));
                    const cidadeNome = cidadeObj ? cidadeObj.nome : null;
                    setError(cidadeNome ? `A cidade ${cidadeNome} não possui nenhum consultório cadastrado` : "Nenhum Consultório cadastrado nesta cidade");
                } else if (estado) {
                    setError(`O estado ${estado} não possui nenhum consultório cadastrado`);
                } else {
                    setError("Nenhum Consultório cadastrado");
                }
                setNewConsultorio([]);
            } else {
                const consultorioComImagens = await Promise.all(consultorios.map(async (item) => {
                    try {
                        const imageResponse = await axios.get(`${apiUrl}/api/consultorio/${item.id}/imagem`, { responseType: 'blob' });
                        const image = URL.createObjectURL(imageResponse.data);
                        return { ...item, url: image };
                    } catch (error) {
                        return { ...item, url: null };
                    }
                }));
                setNewConsultorio(consultorioComImagens);
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
            
            if (err.response?.status === 404 || err.response?.data?.content?.length === 0) {
                if (cidadeId) {
                    const cidadeObj = cidades.find(c => String(c.idIbge) === String(cidadeId));
                    const cidadeNome = cidadeObj ? cidadeObj.nome : null;
                    setError(cidadeNome ? `A cidade ${cidadeNome} não possui nenhum consultório cadastrado` : "Nenhum Consultório cadastrado nesta cidade");
                } else if (estado) {
                    setError(`O estado ${estado} não possui nenhum consultório cadastrado`);
                } else {
                    setError("Nenhum Consultório cadastrado");
                }
                setNewConsultorio([]);
            } else {
                setError("Erro ao conectar com o servidor. Tente novamente.");
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        asyncFunction(searchEstado, searchCidade);
    }, [show]);

    const navigate = useNavigate();

    return (
        <div className="consultorioContainer">
            <h1>Consultórios</h1>
            
            <div className="filterSection">
                <div className="filterGroup">
                    <label htmlFor="ufSelect">Estado:</label>
                    <select
                        id="ufSelect"
                        value={searchEstado}
                        onChange={handleUfChange}
                        className="filterSelect"
                    >
                        <option value="">Selecione um UF</option>
                        {ufs.map(uf => (
                            <option key={uf} value={uf}>{uf}</option>
                        ))}
                    </select>
                </div>

                {searchEstado && (
                    <div className="filterGroup">
                        <label htmlFor="cidadeSelect">Cidade:</label>
                        {loadingCidades ? (
                            <p className="loadingText">Carregando cidades...</p>
                        ) : (
                            <select
                                id="cidadeSelect"
                                value={searchCidade}
                                onChange={(e) => setSearchCidade(e.target.value)}
                                className="filterSelect"
                            >
                                <option value="">Selecione uma cidade</option>
                                {cidades.map(cidade => (
                                    <option key={cidade.idIbge} value={cidade.idIbge}>
                                        {cidade.nome}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                        onClick={() => asyncFunction(searchEstado, searchCidade)}
                        className="botaoEstado"
                    >
                        Pesquisar
                    </button>
                    <button className="botaoLimpar" onClick={() => {
                        setSearchEstado("");
                        setSearchCidade("");
                        setCidades([]);
                        asyncFunction("", "");
                    }}>
                        Limpar Filtro
                    </button>
                </div>
            </div>

            <div className="toggleContainer">
                <span className="toggleLabel">Estilo:</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={newSwitch}
                        onChange={() => setNewSwitch(!newSwitch)}
                    />
                    <span className="slider round"></span>
                </label>
            </div>

            <div className={newSwitch ? "displayDeConsultoriosLista" : "displayDeConsultorios"}>
                {newConsultorio.map((consultorio) => (
                    <div key={consultorio.id} className={newSwitch ? "ConsultorioCard" : "Consultorio"}>
                        {!newSwitch && (
                            <img
                                src={consultorio.url || notLogin}
                                alt={consultorio.nome}
                                className="consultorio-image"
                            />
                        )}
                        <p className="consultorioNome">
                            <strong>Nome:</strong> {consultorio.nome || "Não encontrado"}
                        </p>
                        <p className="endereco">
                            Endereço: {consultorio.endereco || "Não encontrado"}
                        </p>
                        <p className="cep">
                            CEP: {consultorio.cep || "Não encontrado"}
                        </p>
                        {newSwitch && <p>Estado: {consultorio.estado}</p>}
                        
                        <button
                            className={newSwitch ? "showMoreButton" : "Edit"}
                            onClick={() => ToggleshowMore(consultorio.id)}
                        >
                            Ver Mais
                        </button>

                        {showMore === consultorio.id && (
                            <div className="overlay">
                                <ShowConsultorio
                                    onClose={() => setShowMore(null)}
                                    consultorioId={consultorio.id}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {Error && <div className="error">{Error}</div>}

            <button
                className="botaoCadastrarConsultorio"
                onClick={() => navigate("/registerConsultorio")}
            >
                Cadastrar Consultório
            </button>

            {IsLoading && <LoadingSpin />}
        </div>
    );
};

export default MainConsultorio;