
import "./newConsultorio.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../Extras/InputField/InputField.jsx";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import NewVeterinario from "../../Veterinario/newVeterinario/newVeterinario.jsx";

const NewConsultorio = () => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataDeFundacao, setDataDeFundacao] = useState("");
  const [estado, setEstado] = useState("")
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVeterinario, setShowVeterinario] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const isInvalid = (e) => e.target.classList.add("isInvalid");
  const isValid = (e) => {
    if (e.target.value && e.target.classList.contains("isInvalid")) {
      e.target.classList.remove("isInvalid");
    }
  };

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

  const CheckPhone = (PHONE) => {
    const onlyDigits = PHONE.replace(/\D/g, '');
    if (onlyDigits.length === 10 || onlyDigits.length === 11) {
      setError(null);
      return true;
    }
    else {
      setError('Formato de Telefone Inválido!');
      return false;
    }
  }

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
    setEstado("")
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CheckDate(dataDeFundacao) || !CheckPhone(telefone)) return;
    if (!document.getElementById("formsNewConsultorio").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newConsultorio = {
      nome,
      endereco,
      telefone : telefone.replace(/\D/g, ""),
      descricao,
      dataDeFundacao,
      estado
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/consultorio`, newConsultorio);
      console.log("New Consultorio:", response.data);
      handleReset();
      setSuccess("Consultório adicionado com sucesso!");
      setIsLoading(false);  
      navigate('/login')
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      }
    }
  };

  function maskPhone(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }

  

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
            <option value="DistritoFederal">Distrito Federal</option>
            <option value="EspíritoSanto">Espírito Santo</option>
            <option value="Goiás">Goiás</option>
            <option value="Maranhão">Maranhão</option>
            <option value="MatoGrosso">Mato Grosso</option>
            <option value="MatoGrossodoSul">Mato Grosso do Sul</option>
            <option value="MinasGerais">Minas Gerais</option>
            <option value="Pará">Pará</option>
            <option value="Paraíba">Paraíba</option>
            <option value="Paraná">Paraná</option>
            <option value="Pernambuco">Pernambuco</option>
            <option value="Piauí">Piauí</option>
            <option value="Rio de Janeiro">Rio de Janeiro</option>
            <option value="RioGrandedoNorte">Rio Grande do Norte</option>
            <option value="RioGrandedoSul">Rio Grande do Sul</option>
            <option value="Rondônia">Rondônia</option>
            <option value="Roraima">Roraima</option>
            <option value="SantaCatarina">Santa Catarina</option>
            <option value="SãoPaulo">São Paulo</option>
            <option value="Sergipe">Sergipe</option>
            <option value="Tocantins">Tocantins</option>
          </select>
        </div>
        
        <InputField
          label="Telefone"
          placeholder="Informe o telefone do consultório"
          name="telefone"
          idInput="newTelefone"
          classNameDiv="inputTelefone"
          value={maskPhone(telefone)}
          onChange={(e)=> {
             const masked = maskPhone(e.target.value);
             setTelefone(masked);
             isValid(e);
            }}
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
        <InputField
          label="Data de Fundação"
          placeholder="Data de Fundação do consultório"
          name="dataDeFundacao"
          type="date"
          idInput="newDataDeFundacao"
          classNameDiv="inputDataDeFundacao"
          value={dataDeFundacao}
          onChange={(e)=> { setDataDeFundacao(e.target.value); isValid(e); }}
          onInvalid={(e)=> isInvalid(e)}
          required
        />
        <button 
          type="button" 
          id="newVeterinarioButton"
          className="cadastrarVeterinario"
          onClick={() => setShowVeterinario(true)}
        >
          Novo Veterinario
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