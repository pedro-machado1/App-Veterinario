import "./newVacina.css";
import { useState } from "react";
import InputField from "../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin";

const NewVacina = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [validade, setValidade] = useState("");
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const isInvalid = (e) => e.target.classList.add("isInvalid");
  const isValid = (e) => {
    if (e.target.value && e.target.classList.contains("isInvalid")) {
      e.target.classList.remove("isInvalid");
    }
  };

  const handleReset = () => {
    const form = document.getElementById("formsNewVacina");
    const elements = form.getElementsByClassName("isInvalid");
    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
    setNome("");
    setDescricao("");
    setValidade("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById("formsNewVacina").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newVacina = {
      nome,
      descricao,
      validade: parseInt(validade, 10)
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/vacina`, newVacina);
      console.log("New Vacina:", response.data);
      handleReset();
      setSuccess("Vacina adicionada com sucesso!");
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
    <div className="vacina-container">
      <h1 className="title">Registre uma vacina</h1>
      <form id="formsNewVacina" onReset={handleReset} onSubmit={handleSubmit}>
        <InputField
          label="Nome"
          placeholder="Informe o nome da vacina"
          name="nome"
          idInput="newNome"
          classNameDiv="inputNome"
          value={nome}
          onChange={(e) => { setNome(e.target.value); isValid(e); }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <InputField
          label="Descrição"
          placeholder="Informe a descrição da vacina"
          name="descricao"
          idInput="newDescricao"
          classNameDiv="inputDescricao"
          value={descricao}
          onChange={(e) => { setDescricao(e.target.value); isValid(e); }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <InputField
          label="Validade"
          placeholder="Informe a validade da vacina"
          name="validade"
          idInput="newValidade"
          classNameDiv="inputValidade"
          type="number"
          value={validade}
          onChange={(e) => { setValidade(e.target.value); isValid(e); }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <div className="errorsOrSuccess">
          <p style={{color:"red"}}>{Error && Error}</p>
          <p style={{color:"green"}}>{Success && Success}</p>
        </div>
        <button type="submit" className="submit">Enviar</button>
        <button type="reset" className="cancelar" onClick={handleReset}>Cancelar</button>
      </form>
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default NewVacina;