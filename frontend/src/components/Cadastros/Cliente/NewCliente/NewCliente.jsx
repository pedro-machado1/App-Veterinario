import "./NewCliente.css";
import { useState, useRef } from 'react';
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import notLogin from "../../../../assets/images/notLogin.png";
import { listarCidadesPorUf } from "../../../../services/locationService.js";

const NewCliente = () => {

  const [newName, setName] = useState("");
  const [newCpf, setCpf] = useState("");
  const [newPhone, setPhone] = useState("");
  const [newdataDeNascimento, setdataDeNascimento] = useState("");
  const [newEndereco, setEndereco] = useState("");
  
  const [newEstado, setNewEstado] = useState("");
  const [newCidade, setNewCidade] = useState("");
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  const [imagem, setImagem] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const ufs = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  const ufToCodigo = {
    AC: 12, AL: 27, AP: 16, AM: 13, BA: 29, CE: 23, DF: 53,
    ES: 32, GO: 52, MA: 21, MT: 51, MS: 50, MG: 31, PA: 15,
    PB: 25, PR: 41, PE: 26, PI: 22, RJ: 33, RN: 24, RS: 43,
    RO: 11, RR: 14, SC: 42, SP: 35, SE: 28, TO: 17
  };

  const handleUfChange = async (e) => {
    const uf = e.target.value;
    setNewEstado(uf);
    setNewCidade("");
    setCidades([]);
    isValid(e);

    if (uf) {
      setLoadingCidades(true);
      try {
        const cidadesList = await listarCidadesPorUf(uf);
        setCidades(Array.isArray(cidadesList) ? cidadesList : []);
      } catch (err) {
        console.error("Erro ao carregar cidades:", err);
        setCidades([]);
      }
      setLoadingCidades(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImagem(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImg(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setError("Por favor, selecione um arquivo de imagem válido.");
      }
    }
  };

  const handleImageAreaClick = () => {
    fileInputRef.current?.click();
  };

  const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
  };

  const isValid = (e) => {
    if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
      e.target.classList.remove("isInvalid");
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

  const handleReset = () => {
    let form = document.getElementById("formsNewClient");
    let elements = form.getElementsByClassName("isInvalid");

    while (elements.length > 0) {
      elements[0].classList.remove("isInvalid");
    }

    setName("");
    setCpf("");
    setPhone("");
    setdataDeNascimento("");
    setEndereco("");
    setNewEstado("");
    setNewCidade("");
    setCidades([]);
    setImagem("");
    setPreviewImg(null);
    setError(null);
    setSuccess(null);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !CheckCpf(newCpf) ||
      !CheckPhone(newPhone) ||
      !CheckDate(newdataDeNascimento)
    ) return;

    if (!newEstado || !newCidade) {
        setError("Selecione Estado e Cidade!");
        return;
    }

    const newClient = {
      nome: newName,
      cpf: newCpf.replace(/\D/g, ""),
      telefone: newPhone.replace(/\D/g, ""),
      dataDeNascimento: newdataDeNascimento,
      endereco: newEndereco,
      estado: { codigoUf: ufToCodigo[newEstado] },
      cidade: { idIbge: newCidade }
    };

    if (!document.getElementById("formsNewClient").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    setIsLoading(true);

    const formData = new FormData();

    const clienteBlob = new Blob([JSON.stringify(newClient)], { type: 'application/json' });
    formData.append("cliente", clienteBlob);

    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await axios.post(
        `${apiUrl}/api/cliente`,
        formData,
      );
      console.log('New Client:', response.data);
      handleReset();
      setSuccess("Cliente adicionado com sucesso!");
      setIsLoading(false);
      navigate('/animal')
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
    <div className="cliente-container-new ">
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

        <div className="line3" >
          <div>
            <InputField
              label="Endereço"
              placeholder={"Digite o endereço"}
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
          </div>

          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', marginBottom: '5px', color: 'var(--text-color)' }}>UF</label>
            <select
                value={newEstado}
                onChange={handleUfChange}
                required
                className="input-padrao"
                style={{ height: '45px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                onInvalid={(e) => isInvalid(e)}
            >
                <option value="">UF</option>
                {ufs.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                ))}
            </select>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '14px', marginBottom: '5px', color: 'var(--text-color)' }}>Cidade</label>
            <select 
                value={newCidade} 
                onChange={(e) => {
                    setNewCidade(e.target.value);
                    isValid(e);
                }} 
                required
                disabled={!newEstado || loadingCidades}
                style={{ height: '45px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                onInvalid={(e) => isInvalid(e)}
            >
                <option value="">{loadingCidades ? "Carregando..." : "Selecione"}</option>
                {cidades.map(city => (
                    <option key={city.idIbge} value={city.idIbge}>{city.nome}</option>
                ))}
            </select>
          </div>
        </div>

        <div
          className={`imagePreview ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleImageAreaClick}
        >
          {previewImg ? (
            <img
              src={previewImg}
              alt="Preview do Cliente"
              className="cliente-image"
            />
          ) : (
            <img
              src={notLogin}
              alt="Nenhuma imagem disponível"
              className="cliente-image"
            />
          )}
          <div>
            <p className="dragDropText">Clique ou arraste a imagem aqui</p>
            <input
              ref={fileInputRef}
              type="file"
              id="newImagem"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>
        <div className="errorsOrSuccess">
          <p style={{ color: "red" }}>{Error && Error}</p>
          <p style={{ color: "green" }}>{Success && Success}</p>
        </div>
        <div className="botoesPrincipais">
          <button
            type="submit"
            onClick={handleSubmit}
            className="submit">
            Enviar
          </button>
        </div>
      </form>
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default NewCliente;