import { useEffect, useState } from "react";
import ShowCliente from "../../ShowCliente/ShowCliente.jsx";
import axios from "axios";
import LoadingSpin from "../../../../Extras/LoadingSpin/LoadingSpin.jsx";
import { useNavigate } from "react-router-dom";
import InputField from "../../../../Extras/InputField/InputField.jsx";
import "./MainClienteAdmin.css"; 
import AddCliente from "../../../Consultorio/addCliente/addCliente.jsx";
import { listarCidadesPorUf } from "../../../../../../src/services/locationService.js"

const MainClienteAdmin = ( { 
    onClose,
    consultorioId
}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAddCliente, setShowAddCliente] = useState(false);
    const [showMoreCliente, setShowMoreCliente] = useState(null);

    const [searchCpf, setSearchCpf] = useState("");
    const [searchUf, setSearchUf] = useState("");
    const [searchCidade, setSearchCidade] = useState("");
    const [cidades, setCidades] = useState([]);
    const [loadingCidades, setLoadingCidades] = useState(false);
    const [error, setError] = useState(null);
    
    const ufs = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];


    function maskCpf(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    const handleUfChange = async (e) => {
        const uf = e.target.value;
        setSearchUf(uf);
        setSearchCidade("");
        setCidades([]);

        if (uf) {
            setLoadingCidades(true);
            try {
                const cidadesList = await listarCidadesPorUf(uf);
                setCidades(cidadesList || []);
            } catch (err) {
                console.error("Erro ao carregar cidades:", err);
                setCidades([]);
            }
            setLoadingCidades(false);
        }
    };


    const ToggleshowAdd = () => {
        setShowAddCliente((prev) => !prev)
    };

    const showMoreToggle = (clienteId) => {
        if (showMoreCliente === clienteId) {
            setShowMoreCliente(null);
        } else {
            setShowMoreCliente(clienteId);
        }
    };
    const fetchClientes = async (cpf = "", cidadeId = "") => {
        setIsLoading(true);
        setError(null);
        
        let url = `${apiUrl}/api/${consultorioId}/cliente`;
        const params = [];
        
        if (cpf !== "") {
            params.push(`cpf=${cpf}`);
        }
        if (cidadeId !== "") {
            params.push(`cidade_id=${cidadeId}`);
        }
        
        if (params.length > 0) {
            url += `?${params.join("&")}`;
        }
        
        try {
            const response = await axios.get(url);
            if (response.data.content.length === 0) {
                setError("Nenhum cliente encontrado.");
                setClientes([]);
            } else {
                setClientes(response.data.content);
                console.log(response.data.content)
            }
        } catch (err) {
            console.error("Erro ao carregar os clientes:", err);
            setError("Ocorreu um erro ao carregar os clientes.");
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchClientes();
    }, []); 

    const handleDelete = async (clienteId) => {
        setIsLoading(true)
        try{
        const response = await axios.delete(`${apiUrl}/api/consultorio/removecliente/${clienteId}`)
        setClientes((prev) => prev.filter((cliente) => cliente.id !== clienteId));
        console.log(response.data)
        }catch(err){
        setError("Erro ao Deletar esse Cliente do seu Consultorio")
        }
        setIsLoading(false)
    }
  
    const navigate = useNavigate();

    return (
        <div className= "clienteContainer">
            
            <h1>Clientes</h1>
            <div className="searchContainer">
                <div className="filterSection">
                    <div className="filterGroup">
                        <label htmlFor="ufSelect">Filtrar por UF:</label>
                        <select 
                            id="ufSelect"
                            value={searchUf} 
                            onChange={handleUfChange}
                            className="filterSelect"
                        >
                            <option value="">Selecione um UF</option>
                            {ufs.map(uf => (
                                <option key={uf} value={uf}>{uf}</option>
                            ))}
                        </select>
                    </div>

                    {searchUf && (
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
                                        <option key={cidade.id} value={cidade.id}>{cidade.nome}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                    )}
                </div>

                {/* Filtro por CPF */}
                <form onSubmit={(e) => {
                    e.preventDefault()
                    fetchClientes(searchCpf, searchCidade)
                }}>
                <InputField
                    placeholder="Pesquisar por CPF"
                    value={maskCpf(searchCpf)}
                    onChange={(e) => setSearchCpf(e.target.value)}
                    />
                </form>
                <button 
                onClick={() => fetchClientes(searchCpf, searchCidade)}
                className="botaoPesquisar"
                >Pesquisar</button>
                <button className= "botaoLimpar" onClick={() => {  
                    fetchClientes("", "")
                    setSearchCpf("")
                    setSearchUf("")
                    setSearchCidade("")
                    setCidades([])
                    } } >
                        Limpar Filtro
                    </button>
            </div>
            <div className="displayDeClientes">
                {clientes.map((cliente) => (
                    <div key={cliente.id} className="ClienteCard">
                        <p className="clienteNome">
                            <strong>Nome:</strong> {cliente.nome || "Nome não encontrado"}
                        </p>
                        <p className="cpfNome">
                            <strong>CPF:</strong> {maskCpf(cliente.cpf) || "CPF não encontrado"} 
                        </p> 
                        <p className="dataDeCadastro">
                            <strong>Data de cadastro:</strong> {cliente.dataDeCriacao || "Não encontrado"} 
                        </p> 
                        {/* fzr double confimation */}
                        <button
                            type="button"
                            onClick={() => handleDelete(cliente.id)}
                        >
                            Remover
                        </button>
                        <button 
                            className="showMoreButton"
                            onClick={() => showMoreToggle(cliente.id)}
                        > 
                            Ver Mais
                        </button>
                            {showMoreCliente === cliente.id && 
                                <div className="overlay">
                                    <ShowCliente
                                        onClose={() => setShowMoreCliente(null)}
                                        clienteId={cliente.id}
                                    />
                                </div>
                            }
                    </div> 
                ))}
                <button
                    onClick={ToggleshowAdd}
                    type="button"
                >
                    Adicionar Cliente
                </button>
                <button
                    onClick={onClose}
                >
                    Fechar  
                </button>
                { showAddCliente && (
                    <div className="overlay">
                        <AddCliente 
                            onClose = {() => setShowAddCliente(false)}
                            consultorioId = {consultorioId}
                        /> 
                    </div>
                )
                }

            </div>
            {isLoading && <LoadingSpin />}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default MainClienteAdmin;
