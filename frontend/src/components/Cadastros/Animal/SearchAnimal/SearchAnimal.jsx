import "./SearchAnimal.css"

import { useEffect, useState } from "react";
import ShowAnimal from "../ShowAnimal/ShowAnimal";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";

const SearchAnimal = ({
    onClose,
    onAnimalSelect,
    clienteId
}) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [animal, setAnimals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showMoreAnimal, setShowMoreAnimal] = useState(null);
    const [error, setError] = useState(null);


    function maskCpf(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }


    const showMoreToggle = (animalId) => {
        if (showMoreAnimal === animalId) {
            setShowMoreAnimal(null);
        } else {
            setShowMoreAnimal(animalId);
        }
    };

    const fetchAnimals = async () => {
        setIsLoading(true);
        setError(null);
        
        if (clienteId === "") {
            setAnimals([]); 
            setIsLoading(false);
            return;
        }
        
        let url = `${apiUrl}/api/cliente/animal?idCliente=${clienteId}`;
        
        try {
            const response = await axios.get(url);
            if (response.data.content.length === 0) {
                setError("Nenhum animal encontrado com esse CPF");
                setAnimals([]);
            } else {
                setAnimals(response.data.content);
            }
        } catch (err) {
            console.error("Erro ao carregar o animal:", err);
            setError("Ocorreu um erro ao carregar os animais.");
        }finally{
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnimals();
    }, []); 

    const navigate = useNavigate();

    return(
        <div>
            <button type="button" className="botaoCadastrar" onClick={() => navigate("/registeranimal")}>
                Cadastrar animal
            </button>
            {/* <div className="searchContainer">
                <InputField
                    type="text"
                    placeholder="Pesquisar por CPF"
                    value={maskCpf(searchCpf)}
                    onChange={(e) => setSearchCpf(e.target.value)}
                />
                <button type="button" onClick={fetchAnimals}>Pesquisar</button>
            </div> */}
            <h1>Animais</h1>
            <div className="displayDeanimais">
                {animal.map((animal) => (
                    <div key={animal.id} className="animalCard">
                        <p>
                            <strong>Nome:</strong> {animal.nome || "Nome não encontrado"}
                        </p>
                        <p>
                            <strong>Especie:</strong> {animal.especie || "Especie não encontrado"} 
                        </p> 
                        <button 
                            className="showMoreButton"
                            onClick={() => showMoreToggle(animal.id)}
                        > 
                            Ver Mais
                        </button>
                        {showMoreAnimal === animal.id && 
                            <ShowAnimal
                                onClose={() => setShowMoreAnimal(null)}
                                animalId={animal.id}
                                clienteId={clienteId}
                            />
                        }
                        <button
                            className="selecionarButton"
                            onClick={() => {
                                onAnimalSelect(animal);
                                onClose();
                            }}
                        >
                            Selecionar
                        </button>
                    </div> 
                ))}
            </div>
            <button
                className="Fechar"
                onClick={onClose}
            >
                Fechar
            </button>
            {isLoading && <LoadingSpin />}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default SearchAnimal;
