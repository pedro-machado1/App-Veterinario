// fzr com que vire um pop up na tela 


import "./ClienteUpdate.css"
import { useState, useEffect } from 'react';
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import notLogin from "../../../../assets/images/notLogin.png";

const ClienteUpdate = ({
  id,
  name,
  cpf,
  phone,
  dataDeNascimento,
  endereco,
  onClose

}) => {

  const [newId, setId] = useState(id || "")
  const [newName, setName] = useState(name || "");
  const [newCpf, setCpf] = useState(cpf || "");
  const [newPhone, setPhone] = useState(phone || "");
  const [newDataDeNascimento, setDataDeNascimento] = useState(dataDeNascimento || "");
  const [newEndereco, setEndereco] = useState(endereco || "");
  const [newImagem, setImagem] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [newRemove , setRemove] = useState(true)
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const toggleRemove = () => {
    setRemove((prev) => !prev)
  }


  useEffect(() => {

    const fetchInitialData = async () => {
      
      setIsLoading(true);
      const imageResponse = await axios.get(
            `${apiUrl}/api/cliente/${id}/imagem`,
            { responseType: 'blob' }
          );
          if (imageResponse.data.size > 0) {
            let currentImageUrl = URL.createObjectURL(imageResponse.data);
            setPreviewImg(currentImageUrl);
          } else {
            setPreviewImg(null);
          }
        }

    fetchInitialData()
    setIsLoading(false)
  }, [id, newRemove])

  const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
  };

  const isValid = (e) => {
    if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
      console.log(e.target.className)
      e.target.classList.remove("isInvalid");
    }
  };

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

  const CheckCpf = (CPF) => {
    const onlyDigits = CPF.replace(/\D/g, '');
    if (onlyDigits.length === 11) {
      setError(null);
      return true;
    } else {
      setError('Formato de Cpf Inválido!');
      return false;
    }
  }

  const CheckDate = (DATE) => {
    const today = new Date();
    const inputDate = new Date(DATE);
    if (inputDate > today) {
      setError('Data de Nascimento não pode ser futura!');
      return false;
    } else {
      setError(null);
      return true;
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (
      !CheckCpf(newCpf) ||
      !CheckPhone(newPhone) ||
      !CheckDate(newDataDeNascimento)
    ) return;

    const newClient = {
      nome: newName,
      cpf: parseInt(newCpf.replace(/\D/g, "")),
      telefone: parseInt(newPhone.replace(/\D/g, "")),
      dataDeNascimento: newDataDeNascimento,
      endereco: newEndereco
    };
    if (!document.getElementById("formsNewClient").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    setIsLoading(true);

    
    const formData = new FormData();

    const clienteBlob = new Blob([JSON.stringify(newClient)], { type: 'application/json' });
    formData.append("cliente", clienteBlob);
    
    if (newImagem) {
      formData.append("imagem", newImagem);
    }

    try {
      const response = await axios.put(
        `${apiUrl}/api/cliente`,
        formData,
      );
      console.log('New Client:', response.data);
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
    onClose()
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
    } else {
      setImagem(null);
      setPreviewImg(null);
    }
  };

  const handleRemove =  async () => {
    setIsLoading(true)
    try {
      const response = await axios.delete(
        `${apiUrl}/api/cliente/imagem`
      )
      console.log(response.data)
      toggleRemove()
      setPreviewImg(null)
    }catch(err){
      console.log(err)
    }
    setIsLoading(false)
  }

  return (
    <div className="cliente-container ">
      <form
        id="formsNewClient"
        onSubmit={handleUpdate}>
          <InputField
          label="URL da Imagem"
          placeholder={"Coloque a Imagem de perfil do cliente"}
          idInput="newImagem"
          classNameDiv="inputImagem"
          type="file"
          onChange={handleImageChange}
        />
        {previewImg ? (
          <img
            src={previewImg}
            alt="Preview"
            className="cliente-image"
          />
        ) : (
          <img
            src={notLogin}
            alt="Sem imagem"
            className="cliente-image"
          />
        )}
        <button
          onClick={handleRemove}
          type="button"
          className="removeImagem"
        >
          Remover imagem
        </button>
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
            value={maskCpf(newCpf)}
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
            label="Telefone"
            placeholder={"Digite o telefone do cliente"}
            name={"phone"}
            idInput="newPhone"
            classNameDiv="inputPhone"
            value={maskPhone(newPhone)}
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
            idInput="newDataDeNascimento"
            classNameDiv="inputdataDeNascimento"
            type="date"
            value={newDataDeNascimento}
            onChange={(e) => {
              setDataDeNascimento(e.target.value);
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
          onClick={handleUpdate}
          className="submit">
          Atualizar
        </button>
      </form>
      <button
        type="buttom"
        className="fechar"
        onClick={onClose}>
        Fechar
      </button>

      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default ClienteUpdate;