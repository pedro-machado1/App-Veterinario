import "./MainConsultorio.css"
import ShowConsultorio from "../ShowConsultorio/ShowConsultorio"
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Security/Context/AuthContext";
import { useEffect, useState, useRef } from "react";

const MainConsultorio = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    

    const [newConsultorio, setNewConsultorio] = useState([])
    const [IsLoading, setIsLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [showMore, setShowMore] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [Error, setError] = useState(null)    

    const showMoreToggle = (consultorioid) => {
        if (showMore == consultorioid) {
            setShowMore(null)
        } 
        else {
            setShowMore(consultorioid)
        }
    }


    useEffect(() => {

        const asyncFunction = async () => {
            setIsLoading(true)
            setError(null)
            console.log("Recarregando a página")
            const response = await axios.get(`${apiUrl}/api/consultorio`, {
                withCredentials: true
            }
            )
            if (response.data.content.length == 0) {
                setError("Você não possui nenhum consultorio cadastrado")

                console.error("Você não possui nenhum consultorio cadastrado ")
            }
            else {
                console.log(response.data.content)
                setNewConsultorio(response.data.content)
            }
            setIsLoading(false)
        }

        asyncFunction()
    }, [show])


    const navigate = useNavigate();

    return(
        <div>
        <button className="botaoCadastrarConsultorio" onClick={() => { navigate("/registerConsultorio")}}>
            Cadastrar Consultório
        </button>

        <h1>
            Consultórios
        </h1>
            <div className="displayDeConsultorios">
            {newConsultorio.map((consultorio) => (
                <div key={consultorio.id} className="Consultorio">
                    <p>
                        Nome: {consultorio.nome || "Erro nome não encontrado"}
                    </p>
                    <p>
                        Especie: {consultorio.endereco || "Erro endereço não encontrada"} 
                    </p> 
                    <button 
                    className="Edit"
                    onClick={() => showMoreToggle(consultorio.id)}
                    > 
                        Ver Mais
                    </button>
                    {showMore == consultorio.id && 
                        <ShowConsultorio    
                        onClose={() => setShowMore(null)}
                        consultorioId={consultorio.id}
                    />}`
                </div> 
            ))}
            </div>
            {IsLoading && <LoadingSpin/>}

        </div>
    )
}

export default MainConsultorio;