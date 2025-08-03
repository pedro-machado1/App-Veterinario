import "./NewConsulta.css";
import { useState } from "react";
import InputField from "../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin";

const NewConsulta = () => {
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
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
    const form = document.getElementById("formsNewConsulta");
    const elements = form.getElementsByClassName("isInvalid");
    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
    setTitulo("");
    setTexto("");
    setError(null);
    setSuccess(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById("formsNewConsulta").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newConsulta = {
      titulo,
      texto
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/consulta`, newConsulta);
      console.log("New Consulta:", response.data);
      handleReset();
      setSuccess("Consulta adicionada com sucesso!");
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
    <div className="consulta-container">
      <h1 className="title">Registre uma consulta</h1>
      <form id="formsNewConsulta" onReset={handleReset} onSubmit={handleSubmit}>
        <InputField
          label="Título"
          placeholder="Informe o título da consulta"
          name="titulo"
          idInput="newTitulo"
          classNameDiv="inputTitulo"
          value={titulo}
          onChange={(e) => { setTitulo(e.target.value); isValid(e); }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <InputField
          label="Texto"
          placeholder="Informe o texto da consulta"
          name="texto"
          idInput="newTexto"
          classNameDiv="inputTexto"
          value={texto}
          onChange={(e) => { setTexto(e.target.value); isValid(e); }}
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

export default NewConsulta;