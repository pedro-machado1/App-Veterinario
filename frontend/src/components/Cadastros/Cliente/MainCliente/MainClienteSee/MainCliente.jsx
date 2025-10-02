import { useEffect, useState } from "react";
import ShowCliente from "../../ShowCliente/ShowCliente.jsx";
import axios from "axios";
import LoadingSpin from "../../../../Extras/LoadingSpin/LoadingSpin.jsx";
import { useNavigate } from "react-router-dom";
import InputField from "../../../../Extras/InputField/InputField.jsx";
import "./MainCliente.css"; 

const MainCliente = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMoreCliente, setShowMoreCliente] = useState(null);
    const [searchCpf, setSearchCpf] = useState("");
    const [error, setError] = useState(null);


    function maskCpf(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }


    const showMoreToggle = (clienteId) => {
        if (showMoreCliente === clienteId) {
            setShowMoreCliente(null);
        } else {
            setShowMoreCliente(clienteId);
        }
    };

    const fetchClientes = async (cpf) => {
        setIsLoading(true);
        setError(null);
        
        let url = `${apiUrl}/api/cliente`;
        if (cpf !== "") {
            url += `?cpf=${cpf}`;
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
        fetchClientes(searchCpf);
    }, []); 

    const navigate = useNavigate();

    return (
        <div className= "clienteContainer">
            
            <h1>Clientes</h1>
            <div className="searchContainer">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    fetchClientes(searchCpf)
                }}>
                <InputField
                    placeholder="Pesquisar por CPF"
                    value={maskCpf(searchCpf)}
                    onChange={(e) => setSearchCpf(e.target.value)}
                    />
                </form>
                <button 
                onClick={fetchClientes}
                className="botaoPesquisar"
                >Pesquisar</button>
                <button className= "botaoLimpar" onClick={() => {  
                    fetchClientes("")
                    setSearchCpf("")
                    } } >
                        LimparFiltro
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
            </div>
            <button className="botaoCadastrar" 
            onClick={() => navigate("/registerCliente")}
            >
                Cadastrar Cliente
            </button>
            {isLoading && <LoadingSpin />}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default MainCliente;
