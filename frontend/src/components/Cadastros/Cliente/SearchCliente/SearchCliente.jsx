import { useEffect, useState } from "react";
import ShowCliente from "../ShowCliente/ShowCliente.jsx";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import InputField from "../../../Extras/InputField/InputField";
import "./SearchCliente.css"; 

const SearchCliente = ({
    onClose,
    onClientSelect
}) => {
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

    const fetchClientes = async () => {
        setIsLoading(true);
        setError(null);
        
        if (searchCpf === "") {
            setClientes([]); 
            setIsLoading(false);
            return;
        }
        
        let url = `${apiUrl}/api/cliente?cpf=${searchCpf}`;
        
        try {
            const response = await axios.get(url);
            if (response.data.content.length === 0) {
                setError("Nenhum cliente encontrado com esse CPF");
                setClientes([]);
            } else {
                setClientes(response.data.content);
            }
        } catch (err) {
            console.error("Erro ao carregar o cliente:", err);
            setError("Ocorreu um erro ao carregar os clientes.");
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []); 

    const navigate = useNavigate();

    return(
        <div>
            <button type="button" className="botaoCadastrar" onClick={() => navigate("/registerCliente")}>
                Cadastrar Cliente
            </button>
            <div className="searchContainer">
                <InputField
                    type="text"
                    placeholder="Pesquisar por CPF"
                    value={maskCpf(searchCpf)}
                    onChange={(e) => setSearchCpf(e.target.value)}
                />
                <button type="button" onClick={fetchClientes}>Pesquisar</button>
            </div>
            <h1>Clientes</h1>
            <div className="displayDeClientes">
                {clientes.map((cliente) => (
                    <div key={cliente.id} className="ClienteCard">
                        <p>
                            <strong>Nome:</strong> {cliente.nome || "Nome não encontrado"}
                        </p>
                        <p>
                            <strong>CPF:</strong> {maskCpf(cliente.cpf) || "CPF não encontrado"} 
                        </p> 
                        <button 
                            className="showMoreButton"
                            onClick={() => showMoreToggle(cliente.id)}
                        > 
                            Ver Mais
                        </button>
                        {showMoreCliente === cliente.id && 
                            <ShowCliente
                                onClose={() => setShowMoreCliente(null)}
                                clienteId={cliente.id}
                            />
                        }
                        <button
                            className="selecionarButton"
                            onClick={() => {
                                onClientSelect(cliente);
                                onClose();
                            }}
                        >
                            Selecionar
                        </button>
                    </div> 
                ))}
            </div>
            <button
                className="Fechar"
                onClick={onClose}
            >
                Fechar
            </button>
            {isLoading && <LoadingSpin />}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default SearchCliente;
