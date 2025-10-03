import { useEffect, useState } from "react"
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin"
import NewAnimal from "../NewAnimal/NewAnimal"
import EditAnimal from "../EditAnimal/EditAnimal"
import ShowAnimal from "../ShowAnimal/ShowAnimal"
import InputField from "../../../Extras/InputField/InputField"
import "./MainAnimal.css"
import axios from "axios"
import notLogin from "../../../../assets/images/notLogin.png"



const MainAnimal = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const [newAnimal, setAnimal] = useState([])
    const [IsLoading, setIsLoading] = useState(true)
    const [show, setShow] = useState(false)
    const [newSwitch, setNewSwitch] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(null)
    const [showMore, setShowMore] = useState(null)
    const [showEdit, setShowEdit] = useState(false)
    const [searchName, setSearchNome] = useState("")
    const [Error, setError] = useState(null)

    const showMoreToggle = (animalId) => {
        if (showMore == animalId) {
            setShowMore(null)
        }
        else {
            setShowMore(animalId)
        }
    }

    const showConfirmationToggle = (animalId) => {
        if (showMore == animalId) {
            setShowConfirmation(null)
        }
        else {
            setShowConfirmation(animalId)
        }
    }
    const showEditToggle = (animalId) => {
        if (showEdit == animalId) {
            setShowEdit(null)
        }
        else {
            setShowEdit(animalId)
        }
    }



    const asyncFunction = async (searchname) => {
        setIsLoading(true)
        setError(null)

        let url = `${apiUrl}/api/cliente/animal`
        if (searchname !== "") {
            url += `?nome=${searchname}`
        }

        const response = await axios.get(url 
        )
        if (response.data.content.length == 0) {
            setError("Você não possui nenhum animal cadastrado")
            setAnimal([])

            console.error("Você não possui nenhum animal cadastrado ")
        }
        else {
            console.log(response.data.content)
            const animal = response.data.content
            const animalComImagens = await Promise.all(animal.map(async (animal) => {
                try {
                    const imageResponse = await axios.get(`${apiUrl}/api/animal/${animal.id}/imagem`,
                        { responseType: 'blob' }
                    );
                    const image = URL.createObjectURL(imageResponse.data)
                    console.log(animal + " " + imageResponse.data)
                    return { ...animal, url: image };
                } catch (error) {
                    return { ...animal, url: null };
                }
            }))

            console.log(animal)
            setAnimal(animalComImagens)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        asyncFunction(searchName)
    }, [show, showEdit])

    const onDelete = async (animalId) => {
        try {
            const response = await axios.delete(`${apiUrl}/api/cliente/removeanimal/${animalId}`)
            setAnimal((prev) => prev.filter((a) => a.id !== animalId))
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="AnimalContainer">
            <h1>
                Seus Animais
            </h1>
            <div className="searchContainer">
                <form onSubmit={(e) => {
                    e.preventDefault()
                    asyncFunction(searchName)
                }}>
                <InputField
                    placeholder="Pesquisar por nome"
                    value={searchName}
                    onChange={(e) => setSearchNome(e.target.value)}
                />
                </form>
                <button className= "botaoPesquisar" onClick={() => asyncFunction(searchName)}>Pesquisar</button>
                <button className= "botaoLimpar" onClick={() => {  
                    asyncFunction("")
                    setSearchNome("")
                    } } >
                        LimparFiltro
                </button>
            </div>

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


            {!newSwitch && (
                <div className="displayDeAnimais">
                    {newAnimal.map((animal) => (
                        <div key={animal.id} className="Animal">
                            <div className="ImagemInformacoes">
                                {animal.url ? (
                                    <img src={animal.url} alt={`Foto de ${animal.nome}`} className="animal-image" />
                                ) : (
                                    <img src={notLogin} alt="Imagem não encontrada" className="animal-image" />
                                )}
                                <div className="informacoesAnimais">
                                    <p>
                                        Nome: {animal.nome || "Erro nome não encontrado"}
                                    </p>
                                    <p>
                                        Especie: {animal.especie || "Erro especie não encontrada"}
                                    </p>
                                </div>
                            </div>
                            <div className="botoesAnimais"> 
                                
                                <button
                                    className="Edit"
                                    onClick={() => showEditToggle(animal.id)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="deletar"
                                    onClick={() => { showConfirmationToggle(animal.id) }}
                                >
                                    Deletar
                                </button>
                                <a
                                    href="#" 
                                    className="verMaisLink"
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        showMoreToggle(animal.id);
                                    }}
                                >
                                    Ver Mais
                                </a>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}

            {newSwitch && (
                <div className="displayDeAnimaisLista">
                    {newAnimal.map((animal) => (
                        <div key={animal.id} className="AnimalCard">
                            <p className="animalNome">
                                <strong>Nome:</strong> {animal.nome || "Nome não encontrado"}
                            </p>
                            <p className="especieLista">
                                Espécie: {animal.especie || "Erro espécie não encontrada"}
                            </p>
                             <button
                                    className="botaoEditLista"
                                    onClick={() => showEditToggle(animal.id)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="botaoEditLista"
                                    onClick={() => { showConfirmationToggle(animal.id) }}
                                >
                                    Deletar
                                </button>
                                <button
                                    className="botaoEditLista"
                                    onClick={(e) => {
                                        e.preventDefault(); 
                                        showMoreToggle(animal.id);
                                    }}
                                >
                                    Ver Mais
                                </button>
                        </div> 
                    ))}
                </div>
            )}

            <button
                className="novoAnimalButtom"
                type="buttom"
                onClick={() => {
                    if (show == true) { setShow(false) }
                    else { setShow(true) }
                }}
            >
                Novo Animal
            </button>
            {show &&
                <div className="overlay"> 
                    <NewAnimal
                        onClose={() => setShow(false)}
                    />
                </div>
            }
            {showMore && ( 
                <div className="overlay">
                    <ShowAnimal
                        onClose={() => setShowMore(null)}
                        animalId={showMore}
                        show={showMore}
                    />
                </div>
            )}
            {showEdit && ( 
                <div>
                    <EditAnimal
                        onClose={() => setShowEdit(null)}
                        animalId={showEdit}
                        show={showEdit}
                    />
                </div>
            )}
            
            { showConfirmation &&  
            <div className="overlay">
                <div className="confirmationContainer">
                <h2>
                    Você quer deletar esse animal? 
                </h2>
                <div className="botoesConfirmation">
                    <button className = "confirmation" onClick={() => 
                        {
                            onDelete(showConfirmation)
                            setShowConfirmation(null)
                        }}>
                        Confirmar
                    </button>
                    <button className= "cancelar" onClick={() => setShowConfirmation(null)}>
                        Cancelar
                    </button>
                </div>
                </div>
            </div>
            }
            {IsLoading && <LoadingSpin />}
        </div>
    )
}

export default MainAnimal