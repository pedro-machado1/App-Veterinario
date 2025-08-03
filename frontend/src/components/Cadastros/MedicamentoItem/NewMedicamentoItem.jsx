import "./NewMedicamentoItem.css";
import { useState } from "react";
import InputField from "../../Extras/InputField/InputField"; 
import axios from "axios";

// falta medicamento do medicamentoItem
// arrumar
const MedicamentoItem = () => {
  const [newNome, setNome] = useState("");
  const [newQuantidade, setQuantidade] = useState("");
  const [newDescricao, setDescricao] = useState("");
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
  };

  const isValid = (e) => {
    if (e.target.value && e.target.classList.contains("isInvalid")) {
      e.target.classList.remove("isInvalid");
    }
  };

  const handleReset = () => {
    const form = document.getElementById("formsMedicamentoItem");
    const elements = form.getElementsByClassName("isInvalid");
    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
    setNome("");
    setQuantidade("");
    setDescricao("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById("formsMedicamentoItem").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    setIsLoading(true);
    const newMedicamentoItem = {
      nome: newNome,
      quantidade: parseInt(newQuantidade, 10),
      descricao: newDescricao,
    };
    try {
      const response = await axios.post(
        `${apiUrl}/api/medicamentoItem`,
        newMedicamentoItem
      );
      handleReset();
      setSuccess("Medicamento adicionado com sucesso!");
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
    <div className="medicamentoItem-container">
      <h1 className="title">Registre um medicamento</h1>
      <form
        id="formsMedicamentoItem"
        onReset={handleReset}
        onSubmit={handleSubmit}
      >
        <div className="line1">
          <InputField
            label="Nome"
            placeholder="Digite o nome do medicamento"
            name="nome"
            idInput="newNome"
            classNameDiv="inputNome"
            value={newNome}
            onChange={(e) => {
              setNome(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
        </div>
        <div className="line2">
          <InputField
            label="Quantidade"
            placeholder="Digite a quantidade do medicamento"
            name="quantidade"
            idInput="newQuantidade"
            classNameDiv="inputQuantidade"
            type="number"
            value={newQuantidade}
            onChange={(e) => {
              setQuantidade(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
        </div>
        <div className="line3">
          <InputField
            label="Descrição"
            placeholder="Digite a descrição do medicamento"
            name="descricao"
            idInput="newDescricao"
            classNameDiv="inputDescricao"
            value={newDescricao}
            onChange={(e) => {
              setDescricao(e.target.value);
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
        <button type="submit" onClick={handleSubmit} className="submit">
          Enviar
        </button>
        <button type="reset" className="cancelar" onClick={() => handleReset()}>
          Cancelar
        </button>
      </form>
      {isLoading && <LoadingSpin/>}
    </div>
  );
};

export default MedicamentoItem;