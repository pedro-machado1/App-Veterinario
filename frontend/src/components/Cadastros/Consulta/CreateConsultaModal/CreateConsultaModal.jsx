import "./CreateConsultaModal.css";
import { useState, useEffect } from "react";
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import SearchAnimal from "../../Animal/SearchAnimal/SearchAnimal";

const CreateConsultaModal = ({ onClose, clienteId, clienteNome }) => {

  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [selectedAnimals, setSelectedAnimals] = useState([]); 
  const [showSearchAnimal, setShowSearchAnimal] = useState(false);
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
    const form = document.getElementById("formsCreateConsulta");
    if (form) {
      const elements = form.getElementsByClassName("isInvalid");
      while (elements.length > 0) {
        elements[0].classList.remove("isInvalid");
      }
    }
    setTitulo("");
    setTexto("");
    setError(null);
    setSuccess(null);
    setSelectedAnimals([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById("formsCreateConsulta").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newConsulta = {
      titulo,
      texto,
      cliente: { id: parseInt(clienteId) },
      animal: selectedAnimals.map((a) => ({ id: parseInt(a.id) })),
    };
    console.log(newConsulta);
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/consulta`, newConsulta);
      console.log("New Consulta:", response.data);
      handleReset();
      setSuccess("Consulta adicionada com sucesso!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      }
    }
  };

  const addAnimal = (animal) => {
    setSelectedAnimals((prev) => {
      if (!animal.id) return prev;
      if (prev.some((a) => a.id === animal.id)) return prev;
      return [...prev, animal];
    });
  };

  const removeAnimal = (animalId) => {
    setSelectedAnimals((prev) =>
      prev.filter((a) => String(a.id) !== String(animalId))
    );
  };

  return (
    <div className="createConsultaContainer">
      <div className="createConsultaContent">
        <h2>Criar Consulta</h2>
        <p className="clienteInfo"><strong>Cliente:</strong> {clienteNome}</p>
        
        <form
          id="formsCreateConsulta"
          onReset={handleReset}
          onSubmit={handleSubmit}
        >
          <InputField
            label="Título"
            placeholder="Informe o título da consulta"
            name="titulo"
            idInput="modalTitulo"
            classNameDiv="inputTitulo"
            value={titulo}
            onChange={(e) => {
              setTitulo(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
          <InputField
            label="Texto"
            placeholder="Informe o texto da consulta"
            name="texto"
            idInput="modalTexto"
            classNameDiv="inputTexto"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />

          <button
            type="button"
            className="buttomAnimal"
            onClick={() => setShowSearchAnimal(true)}
          >
            Selecionar Animal
          </button>

          {selectedAnimals.length > 0 && (
            <div className="selectedAnimalsList">
              <h4>Animais selecionados:</h4>
              {selectedAnimals.map((a) => (
                <div key={a.id} className="animalItem">
                  <span>{a.nome}</span>
                  <button type="button" onClick={() => removeAnimal(a.id)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
          )}

          {showSearchAnimal && clienteId && (
            <div>
              <SearchAnimal
                onClose={() => setShowSearchAnimal(false)}
                onAnimalSelect={(animal) => {
                  addAnimal(animal);
                  setShowSearchAnimal(false);
                }}
                clienteId={clienteId}
              />
            </div>
          )}

          {isLoading && <LoadingSpin />}
          <div className="errorsOrSuccess">
            <p style={{ color: "red" }}>{Error && Error}</p>
            <p style={{ color: "green" }}>{Success && Success}</p>
          </div>

          <div className="formButtons">
            <button type="submit" className="submitBtn">
              Enviar
            </button>
            <button type="reset" className="cancelarBtn">
              Cancelar
            </button>
          </div>
        </form>
      </div>
      <button
        type="button"
        className="fecharModal"
        onClick={onClose}>
        ✕
      </button>
    </div>
  );
};

export default CreateConsultaModal;
