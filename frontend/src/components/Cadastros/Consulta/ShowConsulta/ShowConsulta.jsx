import "./ShowConsulta.css"
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import ShowAnimal from "../../Animal/ShowAnimal/ShowAnimal.jsx";


const ShowConsulta = ({ 
    onClose,
    consultaId,
}) => {

    const [newConsulta, setNewConsulta] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const asyncFunction = async () => { 
        if (!consultaId) console.log("Erro na inicialização");
        
        try{ 
            const response = await axios.get(`${apiUrl}/api/consulta/${consultaId}`)
            console.log(response.data)
            setSuccess("A API obteve sucesso")
            setNewConsulta(response.data)
        }catch(err){
            console.log(err)
            setError("Erro no get do animal")
        }
        setIsLoading(false)
    }

    asyncFunction()
    }, [consultaId])

    return (
      <div className="animal-container">
        <h2 className="title">{newConsulta?.titulo || "Nome não encontrado"}</h2>
        <div className="presentAnimalContainer">
            <p>
                {newConsulta?.texto || "Endereço não encontrada"}
            </p>
            <p>
                Data :{newConsulta?.dataCriacao || "CPF não encontrada"}
            </p>
            <p>
                Data De Alteração: {newConsulta?.dataCriacao || "Data não encontrado"}
            </p>
            <p>
                Data De Alteração: {newConsulta?.dataAlteracao || "Data não encontrado"}
            </p>
            
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


}

export default ShowConsulta