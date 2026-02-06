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

        if (estado !== "") params.push(`estado=${estado}`);
        if (cidadeId !== "") params.push(`cidade_id=${cidadeId}`);

        if (params.length > 0) url += `?${params.join("&")}`;

        try {
            const response = await axios.get(url);
            if (response.data.content.length === 0) {
                if (cidadeId !== "") {
                    const cidadeObj = cidades.find(c => String(c.id) === String(cidadeId));
                    const cidadeNome = cidadeObj ? cidadeObj.nome : null;
                    setError(cidadeNome ? `A cidade ${cidadeNome} não possui nenhum consultório cadastrado` : "Nenhum Consultório cadastrado");
                } else {
                    setError("Nenhum Consultório cadastrado");
                }
                setNewConsultorio([]);
            } else {
                const consultorios = response.data.content;
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
            setError("Erro ao carregar os consultórios");
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
                                    <option key={cidade.id} value={cidade.id}>
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