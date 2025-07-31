import "./newVeterinario.css";
import { useState } from "react";
import InputField from "../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin";

const NewVeterinario = () => {
  const [nome, setNome] = useState("");
  const [CRVM, setCRVM] = useState("");
  const [estado, setEstado] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [showVeterinario, setShowVeterinario] = useState(true);
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
    setEstado("");
    setEmail("");
    setTelefone("");
    setEndereco("");
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CheckEmail(email) || !CheckPhone(telefone) || !CheckCRVM(CRVM)) {
      return;
    }
    if (!document.getElementById("formsNewVeterinario").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newVeterinario = {
      nome,
      CRVM: parseInt(CRVM, 10),
      estado,
      email,
      telefone,
      endereco
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/veterinario`, newVeterinario);
      console.log("New Veterinario:", response.data);
      handleReset();
      setSuccess("Veterinário adicionado com sucesso!");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setError(`${err.response.data.message}`);
      }
    }
  };

  const CheckEmail = (email)=> {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(email)) {
      setError(null);
      return true;
    } else {
      setError('Formato de Email Inválido!');
      return false;
    }
  }

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

    const CheckCRVM = (crvm) => {
    const onlyDigits = crvm.replace(/\D/g, '');
    if (onlyDigits.length >= 5 && onlyDigits.length <= 10) {
        setError(null);
        return true;
    } else {
        setError('CRVM deve ter entre 5 e 10 dígitos!');
        return false;
    }
  }

  function maskPhone(value) {
        return value
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .slice(0, 15); 
    }
    function maskCRVM(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 10);
    }
    
  return (
    <>
      {showVeterinario && (
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
              onChange={(e) => { setNome(e.target.value); isValid(e); }}
              onInvalid={(e) => isInvalid(e)}
              required
            />
            <InputField
              label="CRVM"
              placeholder="Informe o CRVM"
              name="CRVM"
              idInput="newCRVM"
              classNameDiv="inputCRVM"
              type="number"
              value={CRVM}
              onChange={(e) => { setCRVM(e.target.value); isValid(e); }}
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
                <option value="AC">AC</option>
                <option value="AP">AP</option>
                <option value="AL">AL</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </div>
            <InputField
              label="Email"
              placeholder="Informe o email"
              name="email"
              idInput="newEmail"
              classNameDiv="inputEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onInvalid={(e) => isInvalid(e)}
              required
            />
            <InputField
                label="Telefone"
                placeholder={"Digite o telefone do cliente"}
                name={"telefone"}
                idInput="newTelefone"
                classNameDiv="inputTelefone"
                value={telefone}
                onChange={(e) => {
                    const masked = maskPhone(e.target.value);
                    setTelefone(masked);
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
              onChange={(e) => { setEndereco(e.target.value); isValid(e); }}
              onInvalid={(e) => isInvalid(e)}
            />
            <div className="errorsOrSuccess">
              <p style={{ color: "red" }}>{Error && Error}</p>
              <p style={{ color: "green" }}>{Success && Success}</p>
            </div>
            <button type="submit" className="submit">Enviar</button>
            <button type="reset" className="cancelar" onClick={handleReset}>Cancelar</button>
            <button
              id="hideVeterinarioButton"
              type="button"
              onClick={() => setShowVeterinario(false)}
            >
              Ocultar Veterinário
            </button>
          </form>
          {isLoading && <LoadingSpin />}
        </div>
      )}
    </>
  );
};

export default NewVeterinario;