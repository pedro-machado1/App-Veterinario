import "./ShowAnimal.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";

const ShowAnimal = ({
    onClose,
    animalId,
}) => { 

    const [newAnimal, setAnimal] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const asyncFunction = async () => { 
        if (!animalId) console.log("Erro na inicialização");
        
        try{ 
            const response = await axios.get(`${apiUrl}/api/animal/${animalId}`)
            console.log(response.data)
            setSuccess("A API obteve sucesso")
            setAnimal(response.data)
        }catch(err){
            console.log(err)
            setError("Erro no get do animal")
        }
        setIsLoading(false)
    }

    asyncFunction()
    }, [animalId])

    return (
      <div className="animal-container">
        <h2 className="title"> {newAnimal?.nome || "Nome não encontrado"} </h2>
        <div className="presentAnimalContainer">
            <p>{newAnimal?.especie || "Espécie não encontrada"}</p>
            <p>{newAnimal?.idade || "Idade não encontrada"}</p>
            <p>{newAnimal?.genero || "Gênero não encontrado"}</p>
            <p>{newAnimal?.altura ? newAnimal.altura + " cm" : "Altura não encontrada"}</p>
            <p>{newAnimal?.comprimento ? newAnimal.comprimento + " cm" : "Comprimento não encontrado"}</p>
            <p>{newAnimal?.peso ? newAnimal.peso + " kg" : "Peso não encontrado"}</p>
            <p>{newAnimal?.doenca || "Doença não encontrada"}</p>
            <p>{newAnimal?.alergia || "Alergia não encontrada"}</p>
            <p>{newAnimal?.raca || "Raça não encontrada"}</p>
     
        </div>
        <button
        type="buttom"
        className="fechar"
        onClick={onClose}>
            Fechar
        </button>
      {isLoading && <LoadingSpin />}
      </div>
    );
};

export default ShowAnimal;