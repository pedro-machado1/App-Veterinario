import "./ShowAnimal.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import MainConsultaAnimal from "../../Consulta/MainConsulta/MainConsultaAnimal/MainConsultaAnimal.jsx";

const ShowAnimal = ({
    onClose,
    animalId,
    clienteId,
}) => {

    const [newShowConsulta, setNewShowConsulta] = useState(null)
    const [newAnimal, setAnimal] = useState(null)
    const [newImagem, setImagem] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    const toggleShowConsulta = () => {
        setNewShowConsulta((prev) => !prev)
    }


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
                        responseType: 'blob'}
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
    }, [animalId])

    return (
        <div className="animal-container">
            <h2 className="title"> {newAnimal?.nome || "Nome não encontrado"} </h2>
            <div className="presentAnimalContainer">
                {newImagem ? (
                    <img src={newImagem} alt={`Foto de ${newAnimal?.nome}`} className="animal-image" />
                ) : (
                    <p>Imagem não encontrada.</p>
                )}

                <p>
                    Especie: {newAnimal?.especie || "Espécie não encontrada"}
                </p>
                <p>
                    Idade: {newAnimal?.idade || "Idade não encontrada"}
                </p>
                <p>
                    Gênero: {newAnimal?.genero || "Gênero não encontrado"}
                </p>
                <p>
                    Altura: {newAnimal?.altura ? newAnimal.altura + " cm" : "Altura não encontrada"}
                </p>
                <p>
                    Comprimento: {newAnimal?.comprimento ? newAnimal.comprimento + " cm" : "Comprimento não encontrado"}
                </p>
                <p>
                    Peso: {newAnimal?.peso ? newAnimal.peso + " kg" : "Peso não encontrado"}
                </p>
                <p>
                    Doença: {newAnimal?.doenca || "Doença não encontrada"}
                </p>
                <p>
                    Alergia: {newAnimal?.alergia || "Alergia não encontrada"}
                </p>
                <p>
                    Raça: {newAnimal?.raca || "Raça não encontrada"}
                </p>

            </div>
            <button
                type="buttom"
                className="fechar"
                onClick={onClose}>
                Fechar
            </button>
            <button
              type="buttom"
              className="consultas"
              onClick={toggleShowConsulta}
            >
                Ver Consultas
            </button>

            {newShowConsulta && (
                <MainConsultaAnimal
                    onClose={() => setNewShowConsulta(false)}
                    animalId={animalId}
                />
            )

            }
            {isLoading && <LoadingSpin />}
        </div>
    );
};

export default ShowAnimal;