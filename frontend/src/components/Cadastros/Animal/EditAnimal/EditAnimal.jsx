import "./EditAnimal.css";
import { useState, useEffect } from "react";
import axios from "axios";
import InputField from "../../../Extras/InputField/InputField";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import notLogin from "../../../../assets/images/notLogin.png" 

const EditAnimal = ({
    onClose,
    animalId,
    show
}) => {

    const [nome, setNome] = useState("");
    const [especie, setEspecie] = useState("");
    const [idade, setIdade] = useState("");
    const [genero, setGenero] = useState(""); 
    const [altura, setAltura] = useState("");
    const [comprimento, setComprimento] = useState("");
    const [peso, setPeso] = useState("");
    const [doenca, setDoenca] = useState("");
    const [alergia, setAlergia] = useState("");
    const [raca, setRaca] = useState("");
    const [imagem, setImagem] = useState(null); 
    const [previewImg, setPreviewImg] = useState(null); 
  
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        let currentImageUrl = null; 

        const asyncFunction = async () => { 
            if (!show || !animalId) {
                if (!animalId) {
                    console.log("Erro na inicialização: animalId está faltando.");
                }
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            try { 
                const animalResponse = await axios.get(`${apiUrl}/api/animal/${animalId}`);
                console.log("Animal data:", animalResponse.data);
                
                if (animalResponse.data) {
                    setNome(animalResponse.data.nome || "");
                    setEspecie(animalResponse.data.especie || "");
                    setIdade(animalResponse.data.idade || "");
                    setGenero(animalResponse.data.genero || "");
                    setAltura(animalResponse.data.altura || "");
                    setComprimento(animalResponse.data.comprimento || "");
                    setPeso(animalResponse.data.peso || "");
                    setDoenca(animalResponse.data.doenca || "");
                    setAlergia(animalResponse.data.alergia || "");
                    setRaca(animalResponse.data.raca || "");
                } else {
                    setError("Resposta da API inválida para dados do animal.");
                }

                try {
                    const imageResponse = await axios.get(
                        `${apiUrl}/api/animal/${animalId}/imagem`,
                        { responseType: 'blob' }
                    );
                    if (imageResponse.data.size > 0) {
                        currentImageUrl = URL.createObjectURL(imageResponse.data);
                        setPreviewImg(currentImageUrl); 
                    } else {
                        setPreviewImg(null); 
                    }
                } catch (imageErr) {
                    console.error("Erro ao carregar a imagem do animal:", imageErr);
                    setPreviewImg(null); 
                }
                
            } catch (err) {
                console.log(err);
                setError("Erro no get do animal.");
            } finally {
                setIsLoading(false);
            }
        };

        asyncFunction();

    }, [show, animalId]); 

    const isInvalid = (e) => {
      e.target.classList.add("isInvalid");
    };

    const isValid = (e) => {
      if (e.target.value && e.target.className.indexOf("isInvalid") !== -1) {
        e.target.classList.remove("isInvalid");
      }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagem(file); 
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImg(reader.result); 
            };
            reader.readAsDataURL(file);
        } else {
            setImagem(null);
            setPreviewImg(null); 
        }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!document.getElementById("formseditAnimal").reportValidity()) {
        setError("Preencha todos os campos!");
        return;
      }
      setIsLoading(true);

      
      const updateAnimal = {
      nome: nome,
      especie: especie,
      idade: parseInt(idade, 10),
      genero: genero,
      altura: parseInt(altura, 10),
      comprimento: parseInt(comprimento, 10),
      peso: parseInt(peso, 10),
      doenca: doenca,
      alergia: alergia,
      raca: raca,
    };

    const formData = new FormData();

    const animalBlob = new Blob([JSON.stringify(updateAnimal)], { type: 'application/json' });
    formData.append("animal", animalBlob);
    
      if (imagem) { 
        formData.append("imagem", imagem);
      }
      
      try {
        const response = await axios.put(
          `${apiUrl}/api/animal/${animalId}`, 
          formData,
        );
        console.log("Animal updated:", response.data);
        setSuccess("Animal atualizado com sucesso!");
        setIsLoading(false);
        onClose(); 
      } catch (err) {
        setIsLoading(false);
        console.error(err);
        if (err.response && err.response.data) {
          setError(`${err.response.data.message}`);
        } else {
            setError("Erro ao atualizar o animal. Verifique sua conexão ou tente novamente.");
        }
      }
    };

    return (
      <div className="animal-container">
        <h1 className="title">Edite este animal</h1>
        <form  
          id="formseditAnimal"
          onSubmit={handleSubmit}>

            <div className="image-preview-section">
                {previewImg ? (
                    <img
                        src={previewImg}
                        alt="Preview do Animal"
                        style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ccc" }}
                    />
                ) : (
                    <img
                        src={notLogin} 
                        alt="Nenhuma imagem disponível"
                        style={{ width: "150px", height: "150px", objectFit: "cover", borderRadius: "50%", border: "2px solid #ccc" }}
                    />
                )}
                <InputField
                    label="Foto do Animal"
                    idInput="newImagem"
                    classNameDiv="inputImagem"
                    type="file"
                    onChange={handleImageChange}
                />
            </div>

          <div className="line1">
            <InputField
              label="Nome"
              placeholder="Digite o nome do animal"
              name="nome"
              idInput="newNome"
              classNameDiv="inputNome"
              value={nome}
              onChange={(e) => {
                setNome(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
            <InputField
              label="Espécie"
              placeholder="Digite a espécie do animal"
              name="especie"
              idInput="newEspecie"
              classNameDiv="inputEspecie"
              value={especie}
              onChange={(e) => {
                setEspecie(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
          </div>
          <div className="line2">
            <InputField
              label="Idade"
              placeholder="Digite a idade do animal"
              name="idade"
              idInput="newIdade"
              classNameDiv="inputIdade"
              type="number"
              value={idade}
              onChange={(e) => {        
                setIdade(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
            <div className="inputGenero">
              <label htmlFor="newGenero">Gênero</label>
              <select
                id="newGenero"
                value={genero}
                onChange={(e) => setGenero(e.target.value)}
                required
              >
                <option value="" disabled>
                  Selecione...
                </option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="NAO INFORMADO"> NÃO INFORMADO</option>
              </select>
            </div>
          </div>
          <div className="line3">
            <InputField
              label="Altura"
              placeholder="Digite a altura em cm"
              name="altura"
              idInput="newAltura"
              classNameDiv="inputAltura"
              type="number"
              value={altura}
              onChange={(e) => {
                setAltura(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
            <InputField
              label="Comprimento"
              placeholder="Digite o comprimento em cm"
              name="comprimento"
              idInput="newComprimento"
              classNameDiv="inputComprimento"
              type="number"
              value={comprimento}
              onChange={(e) => {
                setComprimento(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
            <InputField
              label="Peso"
              placeholder="Digite o peso em kg"
              name="peso"
              idInput="newPeso"
              classNameDiv="inputPeso"
              type="number"
              value={peso}
              onChange={(e) => {
                setPeso(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
          </div>
          <div className="line4">
            
            <InputField
              label="Doença"
              placeholder="Informe a doença"
              name="doenca"
              idInput="newDoenca"
              classNameDiv="inputDoenca"
              value={doenca}
              onChange={(e) => {
                setDoenca(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
            />
            <InputField
              label="Alergia"
              placeholder="Informe a alergia"
              name="alergia"
              idInput="newAlergia"
              classNameDiv="inputAlergia"
              value={alergia}
              onChange={(e) => {
                setAlergia(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
            />
            <InputField
              label="Raça"
              placeholder="Digite a raça do animal"
              name="raca"
              idInput="newRaca"
              classNameDiv="inputRaca"
              value={raca}
              onChange={(e) => {
                setRaca(e.target.value);
                isValid(e);
              }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
          </div>

          <div className="errorsOrSuccess">
            <p style={{ color: "red" }}>{Error && Error}</p>
            <p style={{ color: "green" }}>{Success && Success}</p>
          </div>
          <button 
            type="submit" 
            onClick={handleSubmit} 
            className="submit">
            Enviar
          </button>
        </form>
        <button
            type="button"
            className="fechar"
            onClick={onClose}>
            Fechar
        </button>

      {isLoading && <LoadingSpin />}
      </div>
    );
}

export default EditAnimal;