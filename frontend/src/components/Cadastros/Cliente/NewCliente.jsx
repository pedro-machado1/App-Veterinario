import "./NewCliente.css";
import { useState } from 'react';
import InputField from "../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin";
import NewAnimal from "../Animal/NewAnimal";
import { useNavigate } from "react-router-dom";

const NewCliente = () => {

  const [newName, setName] = useState("");
  const [newCpf, setCpf] = useState("");
  const [newEmail, setEmail] = useState("");
  const [newPhone, setPhone] = useState("");
  const [newdataDeNascimento, setdataDeNascimento] = useState("");
  const [newEndereco, setEndereco] = useState("");
  const [newImagem, setImagem] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
  };

  const isValid = (e) => {
    if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
      console.log(e.target.className)
      e.target.classList.remove("isInvalid");
    }
  };

  const CheckEmail = (email) => {
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

  const handleReset = () => {
    let form = document.getElementById("formsNewClient");
    let elements = form.getElementsByClassName("isInvalid");

    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }

    setName("");
    setCpf("");
    setEmail("");
    setPhone("");
    setdataDeNascimento("");
    setEndereco("");
    setImagem("");
    setPreviewImg(null);
    setError(null);
    setSuccess(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !CheckCpf(newCpf) ||
      !CheckEmail(newEmail) ||
      !CheckPhone(newPhone) ||
      !CheckDate(newdataDeNascimento)
    ) return;

    const newClient = {
      nome: newName,
      cpf: parseInt(newCpf.replace(/\D/g, "")),
      email: newEmail,
      telefone: parseInt(newPhone.replace(/\D/g, "")),
      dataDeNascimento: newdataDeNascimento,
      endereco: newEndereco
      // imagem: newImagem,
    };
    if (!document.getElementById("formsNewClient").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/cliente`,
        newClient
      );
      console.log('New Client:', response.data);
      handleReset();
      setSuccess("Cliente adicionado com sucesso!");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      if (err.response && err.response.data) {
        setIsLoading(false);
        setError(`${err.response.data.message}`);
      }
    }
  };

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="cliente-container ">
      <h1 className="title">
        Registre um cliente
      </h1>
      <form
        id="formsNewClient"
        onReset={handleReset}
        onSubmit={handleSubmit}>

        <div className="line1">
          <InputField
            label="Nome"
            placeholder={"Digite o nome do cliente"}
            name={"name"}
            idInput="newName"
            classNameDiv="inputName"
            value={newName}
            onChange={(e) => {
              setName(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
          <InputField
            label="CPF"
            placeholder={"Digite o CPF do cliente"}
            name={"cpf"}
            idInput="newCpf"
            classNameDiv="inputCpf"
            value={newCpf}
            onChange={(e) => {
              const masked = maskCpf(e.target.value);
              setCpf(masked);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
        </div>
        <div className="line2">
          <InputField
            label="E-mail"
            placeholder={"Digite o e-mail do cliente"}
            name={"email"}
            type="email"
            idInput="newEmail"
            classNameDiv="inputEmail"
            value={newEmail}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
          <InputField
            label="Telefone"
            placeholder={"Digite o telefone do cliente"}
            name={"phone"}
            idInput="newPhone"
            classNameDiv="inputPhone"
            value={newPhone}
            onChange={(e) => {
              const masked = maskPhone(e.target.value);
              setPhone(masked);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
          <InputField
            label="Data de Nascimento"
            placeholder={"Digite a data de nascimento do cliente"}
            name={"dataDeNascimento"}
            idInput="newdataDeNascimento"
            classNameDiv="inputdataDeNascimento"
            type="date"
            value={newdataDeNascimento}
            onChange={(e) => {
              setdataDeNascimento(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
        </div>
        <div className="line3"></div>
        <InputField
          label="Endereço"
          placeholder={"Digite o endereço do cliente"}
          idInput="newendereco"
          classNameDiv="inputendereco"
          value={newEndereco}
          onChange={(e) => {
            setEndereco(e.target.value);
            isValid(e);
          }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
        <InputField
          label="URL da Imagem"
          placeholder={"Coloque a Imagem de perfil do cliente"}
          idInput="newImagem"
          classNameDiv="inputImagem"
          type="file"
          onChange={handleImageChange}
        />
        {previewImg && (
          <img
            src={previewImg}
            alt="Preview"
            style={{ width: "150px", height: "auto", marginTop: "10px" }}
          />
        )}
        <button className="NovoAnimal"
          type="button"
          onClick={() => navigate('/newAnimal')}>
          Adicionar Animal</button>

        <div className="errorsOrSuccess">
          <p style={{ color: "red" }}>{Error && Error}</p>
          <p style={{ color: "green" }}>{Success && Success}</p>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="submit">
          Enviar
        </button>
        <button
          type="reset"
          className="cancelar"
          onClick={() => handleReset()}
        >
          Cancelar
        </button>
      </form>
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default NewCliente;