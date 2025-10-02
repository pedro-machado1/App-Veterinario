import "./NewConsulta.css";
import { useState } from "react";
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import SearchCliente from "../../Cliente/SearchCliente/SearchCliente";
import SearchAnimal from "../../Animal/SearchAnimal/SearchAnimal";

const NewConsulta = () => {

  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedAnimals, setSelectedAnimals] = useState([]); 
  const [showSearch, setShowSearch] = useState(false);
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

  const toggleShow = () => {
    setShowSearchAnimal((prev) => !prev);
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
    setSelectedClient(null);
    setSelectedAnimals([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById("formsNewConsulta").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newConsulta = {
      titulo,
      texto,
      cliente: { id: parseInt(selectedClient.id) },
      animal: selectedAnimals.map((a) => ({ id: parseInt(a.id) })),
    };
    console.log(newConsulta);
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

  const handleRemoveAnimal = () => {
    setShowSearch(true)
    setShowSearchAnimal(false)
    setSelectedAnimals([])
    setSelectedClient(null)
  }

  const addAnimal = (animal) => {
    setSelectedAnimals((prev) => {
      if (!animal.id) return prev;
      
      // some pq é object

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
    <div className="consulta-container">
      <h1 className="title">Registre uma consulta</h1>
      <form
        id="formsNewConsulta"
        onReset={handleReset}
        onSubmit={handleSubmit}
      >
        <InputField
          label="Título"
          placeholder="Informe o título da consulta"
          name="titulo"
          idInput="newTitulo"
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

        <button
          type="button"
          className="buttomCliente"
          onClick={() => setShowSearch(true)}
        >
          Selecionar Cliente
        </button>
        {selectedClient && (
          <div className="selectedClient">
            <p>Cliente selecionado: {selectedClient.nome}</p>
            <button 
            onClick={handleRemoveAnimal}
            type="button"
            > 
            Remover
            </button>
            <button
             onClick={() => setShowSearchAnimal(true)}
             type="button"
             >
              Selecionar Animal
            </button>
          </div>
        )}

        {selectedAnimals.length > 0 && (
          <div className="selectedAnimalsList">
            <h4>Animais selecionados:</h4>
            {selectedAnimals.map((a) => (
              <div key={a.id}>
                <span>{a.nome}</span>
                <button type="button" onClick={() => removeAnimal(a.id)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        )}

        {showSearch && (
          <SearchCliente
            onClose={() => setShowSearch(false)}
            onClientSelect={(cliente) => setSelectedClient(cliente)}
          />
        )}
        {showSearchAnimal && selectedClient?.id &&  (
          <div>
            <SearchAnimal
              onClose={() => setShowSearchAnimal(false)}
              onAnimalSelect={(animal) => {
                addAnimal(animal);
                setShowSearchAnimal(false);
              }}
              clienteId={selectedClient.id}
            />
          </div>
        )}

        {isLoading && <LoadingSpin />}
        <div className="errorsOrSuccess">
          <p style={{ color: "red" }}>{Error && Error}</p>
          <p style={{ color: "green" }}>{Success && Success}</p>
        </div>
        <button type="submit" className="submit">
          Enviar
        </button>
        <button type="reset" className="cancelar" onClick={handleReset}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default NewConsulta;