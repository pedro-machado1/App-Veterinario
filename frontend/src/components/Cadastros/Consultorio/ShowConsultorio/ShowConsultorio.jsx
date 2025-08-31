import "./ShowConsultorio.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import { useNavigate } from "react-router-dom";

const ShowNewConsultorio = ({
    onClose,
    consultorioId,
}) => { 

    const [newConsultorio, setNewConsultorio] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate("/veterinarios")

    useEffect(() => {
        const asyncFunction = async () => { 
        if (!consultorioId) console.log("Erro na inicialização");
        
        try{ 
            const response = await axios.get(`${apiUrl}/api/consultorio/${consultorioId}`)
            console.log(response.data)
            setSuccess("A API obteve sucesso")
            setNewConsultorio(response.data)
        }catch(err){
            console.log(err)
            setError("Erro no get do animal")
        }
        setIsLoading(false)
    }

    asyncFunction()
    }, [consultorioId])

    return (
      <div className="animal-container">
        <h2 className="title">{newConsultorio?.nome || "Nome não encontrado"}</h2>
        <div className="presentAnimalContainer">
            <p>{newConsultorio?.endereco || "Endereço não encontrada"}</p>
            <p>{newConsultorio?.telefone || "Telefone não encontrado"}</p>
            <p>{newConsultorio?.dataDeFundacao || "Data de fundação não encontrada"}</p>
            <p>{newConsultorio?.dataDeCadastro || "Data de cadastro não encontrada"}</p>
            <p>{newConsultorio?.descricao || "Descrição não encontrado"}</p>
     
        </div>
        <button
        type="buttom"
        className="fechar"
        onClick={onClose}>
            Fechar
        </button>
        <button
        type="buttom"
        className=""
        onClick={() => navigate(`/veterinario?consultorioId=${consultorioId}`,
        )}>
            Ver Veterinários
        </button>
        {isLoading && <LoadingSpin />}
      </div>
    );
};

export default ShowNewConsultorio;