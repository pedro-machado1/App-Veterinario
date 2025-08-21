import "./NewAnimal.css";
import { useState } from "react";
import InputField from "../../Extras/InputField/InputField"; 
import axios from "axios";
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin.jsx";

const NewAnimal = (Cliente) => { 
    const [nome, setNome] = useState("");
    const [especie, setEspecie] = useState("");
    const [idade, setIdade] = useState("");
    const [genero, setGenero] = useState(""); 
    const [altura, setAltura] = useState("");
    const [comprimento, setComprimento] = useState("");
    const [peso, setPeso] = useState("");
    const [texto, setTexto] = useState("");
    const [doenca, setDoenca] = useState("");
    const [alergia, setAlergia] = useState("");
    const [raca, setRaca] = useState("");
  
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const isInvalid = (e) => {
      e.target.classList.add("isInvalid");
    };

    const isValid = (e) => {
      if (e.target.value && e.target.className.indexOf("isInvalid") !== -1) {
        e.target.classList.remove("isInvalid");
      }
    };

    const handleReset = () => {
      let form = document.getElementById("formsNewAnimal");
      let elements = form.getElementsByClassName("isInvalid");
      while (elements.length > 0) {
        elements[0].classList.remove("isInvalid");
      }
      setNome("");
      setEspecie("");
      setIdade("");
      setGenero("");
      setAltura("");
      setComprimento("");
      setPeso("");
      setTexto("");
      setDoenca("");
      setAlergia("");
      setRaca("");
      setError(null);
      setSuccess(null);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!document.getElementById("formsNewAnimal").reportValidity()) {
        setError("Preencha todos os campos!");
        return;
      }
      setIsLoading(true);
      const newAnimal = {
        nome: nome,
        especie: especie,
        idade: parseInt(idade, 10),
        genero: genero,
        altura: parseInt(altura, 10),
        comprimento: parseInt(comprimento, 10),
        peso: parseInt(peso, 10),
        texto: texto,
        doenca: doenca,
        alergia: alergia,
        raca: raca,
      };
      try {
        const response = await axios.post(
          `${apiUrl}/api/animal`, 
          newAnimal
        );
        console.log("New Animal:", response.data);
        handleReset();
        setSuccess("Animal adicionado com sucesso!");
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
        if (err.response && err.response.data) {
          setError(`${err.response.data.message}`);
        }
      }
    };

    return (
      <div className="animal-container">
        <h1 className="title">Registre um animal</h1>
        <form  
          id="formsNewAnimal"
          onReset={handleReset}
          onSubmit={handleSubmit}>
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
                <option value=" NÃO INFORMADO"> NÃO INFORMADO</option>
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
          <div className="line5">
            <InputField
              label="Notas Adicionais"
              placeholder="Alguma informação adicional"
              name="texto"
              idInput="newTexto"
              classNameDiv="inputTexto"
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
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
          <button
            type="reset"
            className="cancelar"
            onClick={() => handleReset()}
          >
            Cancelar
          </button>
        </form>
        {isLoading && <LoadingSpin/>}
      </div>
    );
};

export default NewAnimal;