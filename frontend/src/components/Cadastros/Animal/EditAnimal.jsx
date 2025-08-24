// processar o array e apresentar para o usuario toda a lista 

import { useEffect, useState } from "react"
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin"
import NewAnimal from "./NewAnimal"
import "./EditAnimal.css"
import axios from "axios"

const EditAnimal = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [newAnimal, setAnimal] = useState([])
    const [IsLoading, setIsLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [Error, setError] = useState(null)

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
    }, [])



    return (
        <div>
            <h1>
                Pagina Para Editar Animais
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

export default EditAnimal