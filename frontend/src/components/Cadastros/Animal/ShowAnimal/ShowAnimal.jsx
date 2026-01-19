import "./ShowAnimal.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import EditAnimal from "../EditAnimal/EditAnimal.jsx";
import MainConsultaAnimal from "../../Consulta/MainConsulta/MainConsultaAnimal/MainConsultaAnimal.jsx";
import notLogin from "../../../../assets/images/notLogin.png"

const ShowAnimal = ({
    onClose,
    animalId,
    clienteId,
    onAnimalDeleted
}) => {

    const [activeTab, setActiveTab] = useState("informacoes");
    const [showEdit, setShowEdit] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [newAnimal, setAnimal] = useState(null)
    const [newImagem, setImagem] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    const toggleTab = (tab) => {
        setActiveTab(tab);
    };


    useEffect(() => {
        const asyncFunction = async () => {
            if (!animalId) console.log("Erro na inicialização");

            if (!clienteId) {
                try {
                    const response = await axios.get(`${apiUrl}/api/animal/${animalId}`)
                    console.log(response.data)
                    setSuccess("A API obteve sucesso")
                    setAnimal(response.data)

                    const imagem = await axios.get(`${apiUrl}/api/animal/${animalId}/imagem`, {
                        responseType: 'blob'
                    }
                    )
                    console.log(imagem)
                    const imageUrl = URL.createObjectURL(imagem.data);
                    setImagem(imageUrl);
                    setSuccess("Dados do animal e imagem carregados com sucesso!");

                } catch (err) {
                    console.log(err)
                    setError("Erro no get do animal")
                }
                setIsLoading(false)
            }
            else {
                try {
                    const response = await axios.get(`${apiUrl}/api/animal/${animalId}/cliente?idCliente=${clienteId}`)
                    console.log(response.data)
                    setSuccess("A API obteve sucesso")
                    setAnimal(response.data)
                } catch (err) {
                    console.log(err)
                    setError("Erro no get do animal")
                }
                setIsLoading(false)
            }
        }

        asyncFunction()
    }, [animalId, showEdit])

    const onDelete = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`${apiUrl}/api/cliente/removeanimal/${animalId}`)
            console.log(response.data);
            setSuccess("Animal deletado com sucesso!");
            // Chamar callback para atualizar a lista
            if (onAnimalDeleted) {
                setTimeout(() => {
                    onAnimalDeleted();
                    onClose();
                }, 1000);
            } else {
                setTimeout(() => {
                    onClose();
                }, 1000);
            }
        } catch (err) {
            console.log(err)
            setError("Erro ao deletar animal");
            setIsLoading(false);
        }
    }

    return (
        <div className="animalShowContainer">
            <h2 className="title"> {newAnimal?.nome || "Nome não encontrado"} </h2>
            
            <div className="tabsContainer">
                <div className="tabs">
                    <button 
                        className={`tabButton ${activeTab === "informacoes" ? "active" : ""}`}
                        onClick={() => toggleTab("informacoes")}
                    >
                        Informações
                    </button>
                    <button 
                        className={`tabButton ${activeTab === "consultas" ? "active" : ""}`}
                        onClick={() => toggleTab("consultas")}
                    >
                        Consultas
                    </button>
                    <div className={`tabIndicator ${activeTab}`}></div>
                </div>
            </div>

            <div className={`tabContent informacoes ${activeTab === "informacoes" ? "active" : ""}`}>
                <div className="WrapperImagem">
                    {newImagem ? (
                        <img src={newImagem} alt={`Foto de ${newAnimal?.nome}`} className="animal-image" />
                    ) : (
                        <img src={notLogin} alt="Imagem não encontrada" className="animal-image" />
                    )}
                    <div className="linhasLaterais">
                        <div className="line1">
                            <p className="especie">
                                Especie: {newAnimal?.especie || "Espécie não encontrada"}
                            </p>
                            <p className="idade">
                                Idade: {newAnimal?.idade || "Idade não encontrada"}
                            </p>
                        </div>
                        <div className="line2">
                            <p className="genero">
                                Gênero: {newAnimal?.genero || "Gênero não encontrado"}
                            </p>
                            <p className="altura">
                                Altura: {newAnimal?.altura ? newAnimal.altura + " cm" : "Altura não encontrada"}
                            </p>
                        </div>
                        <div className="line3">
                            <p className="comprimento">
                                Comprimento: {newAnimal?.comprimento ? newAnimal.comprimento + " cm" : "Comprimento não encontrado"}
                            </p>
                            <p className="peso">
                                Peso: {newAnimal?.peso ? newAnimal.peso + " kg" : "Peso não encontrado"}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="line4">
                    <p className="doenca">
                        Doeça diagnosticadas: {newAnimal?.doenca || "Não possui doença"}
                    </p>
                    <p className="alergia">
                        Alergia: {newAnimal?.alergia || "Alergia não encontrada"}
                    </p>
                    <p className="raca">
                        Raça: {newAnimal?.raca || "Raça não encontrada"}
                    </p>
                </div>
            </div>

            <div className={`tabContent consultas ${activeTab === "consultas" ? "active" : ""}`}>
                <MainConsultaAnimal
                    animalId={animalId}
                    onClose={() => {}}
                />
            </div>

            <div className="botaoContainer">
                <div className="botoesPrincipais">

                    <button
                        type="button"
                        className="editar"
                        onClick={() => setShowEdit(true)}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        className="deletar"
                        onClick={() => setShowConfirmation(true)}
                    >
                        Deletar
                    </button>
                </div>

                <button
                    type="button"
                    className="fecharBotao"
                    onClick={onClose}>
                    Fechar
                </button>
            </div>
            {showEdit && (
                <div className="overlay">
                    <EditAnimal
                        onClose={() => {
                            setShowEdit(false);
                        }}
                        animalId={animalId}
                        show={showEdit}
                    />
                </div>
            )}

            {showConfirmation && (
                <div className="overlay">
                    <div className="confirmationContainer">
                        <h2>Você quer deletar esse animal?</h2>
                        <div className="botoesConfirmation">
                            <button
                                className="confirmation"
                                onClick={() => {
                                    onDelete();
                                    setShowConfirmation(false);
                                }}
                            >
                                Confirmar
                            </button>
                            <button
                                className="cancelar"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isLoading && <LoadingSpin />}
        </div>
    );
};

export default ShowAnimal;