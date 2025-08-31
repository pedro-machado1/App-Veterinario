import { useEffect, useState } from "react"
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin"
import NewAnimal from "../NewAnimal/NewAnimal"
import EditAnimal from "../EditAnimal/EditAnimal"
import ShowAnimal from "../ShowAnimal/ShowAnimal"
import "./MainAnimal.css"
import axios from "axios"

const MainAnimal = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [newAnimal, setAnimal] = useState([])
    const [IsLoading, setIsLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [showMore, setShowMore] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [Error, setError] = useState(null)    

    const showMoreToggle = (animalId) => {
        if( showMore == animalId) {
            setShowMore(null)
        }
        else{
            setShowMore(animalId)
        }
    }

    const showEditToggle = (animalId) => {
        if (showEdit == animalId) {
            setShowEdit(null)
        }
        else{
            setShowEdit(animalId)
        }
    }

    useEffect(() => {
        
        
        const asyncFunction = async () => {
            setIsLoading(true)
            setError(null)
            console.log("Recarregando a página")
            const response = await axios.get(`${apiUrl}/api/cliente/animal`, {
                withCredentials: true
            }
            )
            if (response.data.content.length == 0) {
                setError("Você não possui nenhum animal cadastrado")

                console.error("Você não possui nenhum animal cadastrado ")
            }
            else {
                console.log(response.data.content)
                setAnimal(response.data.content)
            }
            setIsLoading(false)
        }

        asyncFunction()
    }, [show, showEdit])

    const onDelete = async (animalId) => {
        try {
        const response = await axios.delete(`${apiUrl}/api/cliente/removeanimal/${animalId}`)
        setAnimal((prev) => prev.filter((a) => a.id !== animalId))        
        }catch(err){
            console.log(err)
        }
    }

    return (
        <div>
            <h1>
                Seus Animais
            </h1>
            <div className="displayDeAnimais">
            {newAnimal.map((animal) => (
                <div key={animal.id} className="Animal">
                    <p>
                        Nome: {animal.nome || "Erro nome não encontrado"}
                    </p>
                    <p>
                        Especie: {animal.especie || "Erro especie não encontrada"} 
                    </p> 
                    <button 
                    className="Edit"
                    onClick={() => showMoreToggle(animal.id)}
                    > 
                        Ver Mais
                    </button>
                    
                    <button 
                    className="Edit"
                    onClick={() => showEditToggle(animal.id)}
                    > 
                        Editar
                    </button>

                    <button 
                    className="deletar"
                    onClick={() => {onDelete(animal.id)} }
                    > 
                        Deletar
                    </button>`
                    {showMore == animal.id && 
                    <ShowAnimal
                    onClose={() => setShowMore(null)}
                    animalId={animal.id}
                    show = {showMore}
                    />}`
                    {showEdit == animal.id && (
                    <div> 
                    <EditAnimal
                    onClose = {() => setShowEdit(null)}
                    animalId = {animal.id}
                    show={showEdit}
                    />
                    </div>
                    )
                    }
                </div> 
            ))}
            <button
            className="novoAnimalButtom"
            type="buttom"
            onClick={() => { 
                if (show == true) { setShow(false)}
                else{ setShow(true)}
            }}
            >
                Novo Animal
            </button>
            {show && 
            <div>
                <NewAnimal
                    onClose = {() => setShow(false)}
                />
            </div>}
            </div>
            {IsLoading && <LoadingSpin/>}
        </div>
    )
}

export default MainAnimal