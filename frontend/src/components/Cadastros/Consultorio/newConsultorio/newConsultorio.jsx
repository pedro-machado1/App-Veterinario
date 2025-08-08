// fzr parte do perfil para concluir essa parte pois checaremos o id para ver se 
// ele está na conta do consultorio com o id do perfil faremos adicionaremos o veterinario;


// fzr update possivel

// tela de visualização do consultório


import "./newConsultorio.css";
import { useState } from "react";
import InputField from "../../../Extras/InputField/InputField.jsx";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import NewVeterinario from "../../Veterinario/addVeterinario/newVeterinario.jsx";

const NewConsultorio = () => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVeterinario, setShowVeterinario] = useState(false);
  
  const apiUrl = import.meta.env.VITE_API_URL;

  const isInvalid = (e) => e.target.classList.add("isInvalid");
  const isValid = (e) => {
    if (e.target.value && e.target.classList.contains("isInvalid")) {
      e.target.classList.remove("isInvalid");
    }
  };

  const handleReset = () => {
    const form = document.getElementById("formsNewConsultorio");
    const elements = form.getElementsByClassName("isInvalid");
    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
    setNome("");
    setEndereco("");
    setTelefone("");
    setDescricao("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document.getElementById("formsNewConsultorio").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newConsultorio = {
      nome,
      endereco,
      telefone,
      descricao,
      veterinario  
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/consultorio`, newConsultorio);
      console.log("New Consultorio:", response.data);
      handleReset();
      setSuccess("Consultório adicionado com sucesso!");
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
    <div className="consultorio-container">
      <h1 className="title">Registre um consultório</h1>
      <form id="formsNewConsultorio" onReset={handleReset} onSubmit={handleSubmit}>
        <InputField
          label="Nome"
          placeholder="Informe o nome do consultório"
          name="nome"
          idInput="newNome"
          classNameDiv="inputNome"
          value={nome}
          onChange={(e)=> { setNome(e.target.value); isValid(e);}}
          onInvalid={(e)=> isInvalid(e)}
          required
        />
        <InputField
          label="Endereço"
          placeholder="Informe o endereço do consultório"
          name="endereco"
          idInput="newEndereco"
          classNameDiv="inputEndereco"
          value={endereco}
          onChange={(e)=> { setEndereco(e.target.value); isValid(e); }}
          onInvalid={(e)=> isInvalid(e)}
          required
        />
        <InputField
          label="Telefone"
          placeholder="Informe o telefone do consultório"
          name="telefone"
          idInput="newTelefone"
          classNameDiv="inputTelefone"
          value={telefone}
          onChange={(e)=> { setTelefone(e.target.value); isValid(e); }}
          onInvalid={(e)=> isInvalid(e)}
          required
        />
        <InputField
          label="Descrição"
          placeholder="Informe a descrição do consultório"
          name="descricao"
          idInput="newDescricao"
          classNameDiv="inputDescricao"
          value={descricao}
          onChange={(e)=> { setDescricao(e.target.value); isValid(e); }}
          onInvalid={(e)=> isInvalid(e)}
          required
        />

        <button 
          type="button" 
          id="newVeterinarioButton"
          className="cadastrarVeterinario"
          onClick={() => setShowVeterinario(true)}
        >
          Novo Veterinário
        </button>
        <div className="errorsOrSuccess">
          <p style={{ color: "red" }}>{Error && Error}</p>
          <p style={{ color: "green" }}>{Success && Success}</p>
        </div>
        <button type="submit" className="submit">Enviar</button>
        <button type="reset" className="cancelar" onClick={handleReset}>Cancelar</button>
      </form>
      {showVeterinario && (
        <div id="targetElement">
          <NewVeterinario 
            onClose={() => setShowVeterinario(false)}
          />
        </div>
      )}
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default NewConsultorio;