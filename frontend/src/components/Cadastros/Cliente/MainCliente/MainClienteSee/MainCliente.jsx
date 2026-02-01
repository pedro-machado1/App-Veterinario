import { useEffect, useState } from "react";
import ShowCliente from "../../ShowCliente/ShowCliente.jsx";
import axios from "axios";
import LoadingSpin from "../../../../Extras/LoadingSpin/LoadingSpin.jsx";
import { useNavigate } from "react-router-dom";
import InputField from "../../../../Extras/InputField/InputField.jsx";
import notLogin from "../../../../../assets/images/notLogin.png"
import "./MainCliente.css";

const MainCliente = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [clientes, setClientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMoreCliente, setShowMoreCliente] = useState(null);
    const [Veterinario, setVeterinario] = useState(false)
    const [newSwitch, setNewSwitch] = useState(false)
    const [searchCpf, setSearchCpf] = useState("");
    const [filterPermission, setFilterPermission] = useState(false)

    const [error, setError] = useState(null);


    function maskCpf(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }


    const ToggleshowMore = (clienteId) => {
        if (showMoreCliente === clienteId) {
            setShowMoreCliente(null);
        } else {
            setShowMoreCliente(clienteId);
        }
    };

    const fetchClientes = async (cpf = "", permission = false) => {
        setIsLoading(true);
        setError(null);

        try {
            let response;

            const verVeterinario = await axios.get(`${apiUrl}/api/auth/authentication`
            )

            if (verVeterinario.data?.veterinario) {
                setVeterinario(true)
            }
            if (permission) {
                response = await axios.get(`${apiUrl}/api/clienteVeterinario/veterinario`);
            }
            // CPF
            else {
                let url = `${apiUrl}/api/cliente`;
                if (cpf !== "") {
                    url += `?cpf=${cpf}`;
                }
                response = await axios.get(url);
            }

            const data = permission ? response.data : response.data.content;

            if (!data || data.length === 0) {
                setClientes([]);
                setError("Nenhum cliente encontrado.");
                return;
            }

            // modo visual com imagem
            if (newSwitch) {
                setClientes(data);
            } else {
                const clientesComImagem = await Promise.all(
                    data.map(async (cliente) => {
                        try {
                            const imageResponse = await axios.get(
                                `${apiUrl}/api/cliente/${cliente.id}/imagem`,
                                { responseType: "blob" }
                            );
                            const imageUrl = URL.createObjectURL(imageResponse.data);
                            return { ...cliente, url: imageUrl };
                        } catch {
                            return { ...cliente, url: null };
                        }
                    })
                );
                setClientes(clientesComImagem);
            }

        } catch (err) {
            console.error(err);
            setError("Erro ao carregar clientes.");
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchClientes(searchCpf, filterPermission);
    }, []);

    const navigate = useNavigate();

    return (
        <div className="clienteContainer">

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
                <button className="botaoLimpar" onClick={() => {
                    fetchClientes("")
                    setSearchCpf("")
                }} >
                    LimparFiltro
                </button>
            </div>

            <div className="togglesRow">

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

                {Veterinario == true && (
                    <div className="toggleContainer">
                        <span className="toggleLabel">Somente meus clientes:</span>
                        <label className="switch">
                            <input
                                type="checkbox"
                                checked={filterPermission}
                                onChange={() => {
                                    const value = !filterPermission;
                                    setFilterPermission(value);
                                    fetchClientes(searchCpf, value);
                                }}
                            />
                            <span className="slider round"></span>
                        </label>
                    </div>
                )}

            </div>

            {newSwitch && (
                <div id="displayDeClientes">
                    {clientes.map((cliente) => (
                        <div key={cliente.id} className="Cliente">
                            <div className="clienteWrapper">

                                <img
                                    src={cliente.url || notLogin}
                                    alt={cliente.nome}
                                    className="cliente-image"
                                />
                                <div className="informacoesCliente">
                                    <p>
                                        <strong>Nome:</strong> {cliente.nome || "Erro: nome não encontrado"}
                                    </p>
                                    <p>
                                        <strong>CPF:</strong> {maskCpf(cliente.cpf) || "Erro: CPF não encontrado"}
                                    </p>
                                    <p>
                                        <strong>Data de cadastro:</strong> {cliente.dataDeCriacao || "Não encontrado"}
                                    </p>
                                </div>
                            </div>

                            <button id="VerMais" onClick={() => ToggleshowMore(cliente.id)}>
                                Ver Mais
                            </button>
                            {showMoreCliente === cliente.id &&
                                <div className="overlay">
                                    <ShowCliente
                                        onClose={() => setShowMoreCliente(false)}
                                        clienteId={cliente.id}
                                    />
                                </div>
                            }
                        </div>
                    ))}
                </div>
            )}


            {!newSwitch && (
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
                                onClick={() => ToggleshowMore(cliente.id)}
                            >
                                Ver Mais
                            </button>
                            {showMoreCliente === cliente.id &&
                                <div className="overlay">
                                    <ShowCliente
                                        onClose={() => setShowMoreCliente(false)}
                                        clienteId={cliente.id}
                                    />
                                </div>
                            }
                        </div>
                    ))}
                </div>
            )}

            {isLoading && <LoadingSpin />}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default MainCliente;
