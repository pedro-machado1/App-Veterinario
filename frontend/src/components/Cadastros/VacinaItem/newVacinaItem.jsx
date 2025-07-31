import "./newVacinaItem.css";
import { useState } from "react";
import InputField from "../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin";

const NewVacinaItem = () => {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [dataValidade, setDataValidade] = useState("");
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
    const form = document.getElementById("formsNewVacinaItem");
    const elements = form.getElementsByClassName("isInvalid");
    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
    setNome("");
    setDescricao("");
    setDataAplicacao("");
    setDataValidade("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById("formsNewVacinaItem").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newVacinaItem = {
      nome,
      descricao,
      dataAplicacao,
      dataValidade
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/vacinaItem`, newVacinaItem);
      console.log("New VacinaItem:", response.data);
      handleReset();
      setSuccess("Vacina aplicada adicionada com sucesso!");
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
    <div className="vacinaItem-container">
      <h1 className="title">Registre uma vacina aplicada</h1>
      <form id="formsNewVacinaItem" onReset={handleReset} onSubmit={handleSubmit}>
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
          placeholder="Informe a descrição (opcional)"
          name="descricao"
          idInput="newDescricao"
          classNameDiv="inputDescricao"
          value={descricao}
          onChange={(e) => { setDescricao(e.target.value); isValid(e); }}
          onInvalid={(e) => isInvalid(e)}
        />
        <InputField
          label="Data de Aplicação"
          placeholder="Informe a data e hora da aplicação"
          name="dataAplicacao"
          idInput="newDataAplicacao"
          classNameDiv="inputDataAplicacao"
          type="datetime-local"
          value={dataAplicacao}
          onChange={(e) => { setDataAplicacao(e.target.value); isValid(e); }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <InputField
          label="Data de Validade"
          placeholder="Informe até que data a vacina é válida"
          name="dataValidade"
          idInput="newDataValidade"
          classNameDiv="inputDataValidade"
          type="date"
          value={dataValidade}
          onChange={(e) => { setDataValidade(e.target.value); isValid(e); }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <div className="errorsOrSuccess">
          <p style={{ color: "red" }}>{Error && Error}</p>
          <p style={{ color: "green" }}>{Success && Success}</p>
        </div>
        <button type="submit" className="submit">Enviar</button>
        <button type="reset" className="cancelar" onClick={handleReset}>Cancelar</button>
      </form>
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default NewVacinaItem;