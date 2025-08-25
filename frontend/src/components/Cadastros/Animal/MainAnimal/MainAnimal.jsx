// processar o array e apresentar para o usuario toda a lista arrumar 

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
    const [showMore, setShowMore] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [Error, setError] = useState(null)

    const showMoreToggle = () => {
        setShowMore((prev) => !prev)
    }

    const showEditToggle = () => {
        setShowEdit((prev) => !prev)
    }

    useEffect(() => {
        const asyncFunction = async () => {
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
                response.data.content.forEach((animal) => {
                })
            }
            setIsLoading(false)
        }

        asyncFunction()
    }, [show, showEdit])

    const onDelete = async (animalId) => {
        const response = axios.delete(`${apiUrl}/api/cliente/removeanimal/${animalId}`)
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
                    onClick={showMoreToggle}
                    > 
                        Ver Mais
                    </button>


                    <button 
                    className="Edit"
                    onClick={showEditToggle}
                    > 
                        Editar
                    </button>

                    <button 
                    className="deletar"
                    onClick={() => {onDelete(animal.id)} }
                    > 
                        Deletar
                    </button>`
                    {showMore && 
                    <ShowAnimal
                    onClose={() => setShow(false)}
                    animalId={animal.id}
                    show = {showMore}
                    />}`
                    {showEdit && (
                    <div> 
                        <p>dlaskfjldasfkj</p>
                    <EditAnimal
                    onClose = {() => setShowEdit(false)}
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