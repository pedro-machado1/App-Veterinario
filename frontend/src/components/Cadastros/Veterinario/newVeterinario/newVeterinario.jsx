import "./newVeterinario.css";
import { useState } from "react";
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";

// fzr para CRVM

const NewVeterinario = ({ onVeterinarioSubmit, onClose }) => {
  const [nome, setNome] = useState("");
  const [crvm, setCRVM] = useState("");
  const [cpf, setCpf] = useState(""); 
  const [estado, setEstado] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dataDeNascimento, setDataDeNascimento] = useState("");
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
    const form = document.getElementById("formsNewVeterinario");
    const elements = form.getElementsByClassName("isInvalid");
    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }
    setNome("");
    setCRVM("");
    setCpf("");
    setEstado("");
    setDataDeNascimento("")
    setTelefone("");
    setEndereco("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CheckPhone(telefone) || !CheckCpf(cpf) || !CheckDate(dataDeNascimento)) {
      return;
    }
    if (!document.getElementById("formsNewVeterinario").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newVeterinario = {
      nome,
      crvm,
      cpf,
      estado,
      telefone,
      endereco,
      dataDeNascimento
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/veterinario`, newVeterinario);
      console.log("New Veterinario:", response.data);
      const add = await axios.put(`${apiUrl}/api/consultorio/addveterinario/${response.data.id}`)
      handleReset();
      setSuccess("Veterinário adicionado com sucesso!");
      setIsLoading(false);
      if (onVeterinarioSubmit) {
        onVeterinarioSubmit(newVeterinario);
      }
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      }
    }
  };

  const CheckPhone = (phone) => {
    const onlyDigits = phone.replace(/\D/g, '');
    if (onlyDigits.length === 10 || onlyDigits.length === 11) {
      setError(null);
      return true;
    } 
    else {
      setError('Formato de Telefone Inválido!');
      return false;
    }
  }

  const CheckCpf = (cpf) => {
    const onlyDigits = cpf.replace(/\D/g, '');
    if (onlyDigits.length === 11) {
      setError(null);
      return true;
    } else {
      setError('Formato de Cpf Inválido!');
      return false;
    }
 }

  const CheckDate = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    if (inputDate > today) {
      setError('Data de Nascimento não pode ser futura!');
      return false;
    } else {
      setError(null);
      return true; 
    }
  }

  function maskCpf(value) {
        return value
          .replace(/\D/g, '') 
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }

    function maskPhone(value) {
        return value
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .slice(0, 15); 
      }

  return (
    <div className="veterinario-container">
      <h1 className="title">Registre um veterinário</h1>
      <form id="formsNewVeterinario" onReset={handleReset} onSubmit={handleSubmit}>
        <InputField
          label="Nome"
          placeholder="Informe o nome"
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
          label="CRVM"
          placeholder="Informe o CRVM"
          name="CRVM"
          idInput="newCRVM"
          classNameDiv="inputCRVM"
          value={crvm}
          onChange={(e) => {
             setCRVM(e.target.value);
              isValid(e); 
          }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <InputField
          label="CPF"
          placeholder="Informe o CPF"
          name="cpf"
          idInput="newCpf"
          classNameDiv="inputCpf"
          value={cpf}
          onChange={(e) => { 
            const mask = maskCpf(e.target.value);
            setCpf(mask);
            isValid(e);
          }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <div className="inputEstado">
          <label htmlFor="newEstado">Estado</label>
          <select
            id="newEstado"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione...
            </option>
            <option value="Acre">Acre</option>
            <option value="Amapá">Amapá</option>
            <option value="Alagoas">Alagoas</option>
            <option value="Amazonas">Amazonas</option>
            <option value="Bahia">Bahia</option>
            <option value="Ceará">Ceará</option>
            <option value="Distrito Federal">Distrito Federal</option>
            <option value="Espírito Santo">Espírito Santo</option>
            <option value="Goiás">Goiás</option>
            <option value="Maranhão">Maranhão</option>
            <option value="Mato Grosso">Mato Grosso</option>
            <option value="Mato Grosso do Sul">Mato Grosso do Sul</option>
            <option value="Minas Gerais">Minas Gerais</option>
            <option value="Pará">Pará</option>
            <option value="Paraíba">Paraíba</option>
            <option value="Paraná">Paraná</option>
            <option value="Pernambuco">Pernambuco</option>
            <option value="Piauí">Piauí</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
            <option value="Rio Grande do Norte">Rio Grande do Norte</option>
            <option value="Rio Grande do Sul">Rio Grande do Sul</option>
            <option value="Rondônia">Rondônia</option>
            <option value="Roraima">Roraima</option>
            <option value="Santa Catarina">Santa Catarina</option>
            <option value="São Paulo">São Paulo</option>
            <option value="Sergipe">Sergipe</option>
            <option value="Tocantins">Tocantins</option>
          </select>
        </div>
        <InputField
          label="Telefone"
          placeholder="Informe o telefone"
          name="telefone"
          idInput="newTelefone"
          classNameDiv="inputTelefone"
          value={telefone}
          onChange={(e) => { 
            const mask = maskPhone(e.target.value);
            setTelefone(mask);
            isValid(e);
          }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <InputField
          label="Endereço"
          placeholder="Informe o endereço (opcional)"
          name="endereco"
          idInput="newEndereco"
          classNameDiv="inputEndereco"
          value={endereco}
          onChange={(e) => { 
            setEndereco(e.target.value);
            isValid(e);
          }}
          onInvalid={(e) => isInvalid(e)}
        />
        <InputField
          label="Data de Nascimento"
          placeholder="Data de Nascimento do consultório"
          name="dataDeNascimento"
          type="date"
          idInput="newDataDeNascimento"
          classNameDiv="inputDataDeNascimento"
          value={dataDeNascimento}
          onChange={(e)=> { setDataDeNascimento(e.target.value); isValid(e); }}
          onInvalid={(e)=> isInvalid(e)}
          required
        />
        <div className="errorsOrSuccess">
          <p style={{ color: "red" }}>{Error && Error}</p>
          <p style={{ color: "green" }}>{Success && Success}</p>
        </div>
        <button type="submit" className="submit">Enviar</button>
        <button type="reset" className="cancelar" onClick={handleReset}>Cancelar</button>
        <button 
          type="button" 
          id="hideVeterinarioButton"
          onClick={onClose}
          className="fecharButton"
        >
          Fechar
        </button>
      </form>
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default NewVeterinario;