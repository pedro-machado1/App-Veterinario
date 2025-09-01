import "./ConsultorioUpdate"
import { useState, useEffect } from 'react';
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";

const ConsultorioUpdate = ({
  name,
  phone,
  dataDeFundacao,
  endereco,
  estado,
  imagem,
  descricao,
  onClose,

}) => {

  const [newName, setName] = useState("");
  const [newPhone, setPhone] = useState("");
  const [newDataDeFundacao, setDataDeFundacao] = useState("");
  const [newEndereco, setEndereco] = useState("");
  const [newDescricao, setNewDescricao] = useState("")
  const [newEstado, setNewEstado] = useState("");
  const [newImagem, setImagem] = useState("");
  const [previewImg, setPreviewImg] = useState(null);
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();


  useEffect(() => {
    if (name) setName(name);
    if (phone) setPhone(phone);
    if (dataDeFundacao) setDataDeFundacao(dataDeFundacao);
    if (endereco) setEndereco(endereco);
    if (estado) setNewEstado(estado);
    if (descricao) setNewDescricao(descricao);
    if (imagem) setImagem(imagem);
  }, [name, phone, dataDeFundacao, endereco, descricao, imagem, estado])

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
      !CheckPhone(newPhone) ||
      !CheckDate(newDataDeFundacao)
    ) return;

    const UpdateConsultorio = {
      nome: newName,
      telefone: parseInt(newPhone.replace(/\D/g, "")),
      dataDeFundacao: newDataDeFundacao,
      descricao: newDescricao,
      endereco: newEndereco,
      estado: newEstado
      // imagem: newImagem
    };
    if (!document.getElementById("formsUpdateConsultorio").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/api/consultorio`,
        UpdateConsultorio,
        { withCredentials: true }
      );
      console.log('New Consultorio:', response.data);
      setSuccess("Consultorio adicionado com sucesso!");
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
    <div className="consultorio-container ">
      <h1 className="title">
        Atualize o Seu Constultório
      </h1>
      <form
        id="formsUpdateConsultorio"
        onSubmit={handleUpdate}>

        <div className="line1">
          <InputField
            label="Nome"
            placeholder={"Digite o nome do consultório"}
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
        </div>
        <div className="line2">
          <InputField
            label="Telefone"
            placeholder={"Digite o telefone do consultório"}
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
            label="Data de Fundação"
            placeholder={"Digite a data de Fundação do Consultorio"}
            name={"DataDeFundacao"}
            idInput="newDataDeFundacao"
            classNameDiv="inputDataDeFundacao"
            type="date"
            value={newDataDeFundacao}
            onChange={(e) => {
              setDataDeFundacao(e.target.value);
              isValid(e);
            }}
            onInvalid={(e) => isInvalid(e)}
            required
          />
        </div>
        <div className="line3"></div>
        <div className="inputEstado">
          <label htmlFor="newEstado">Estado</label>
          <select
            id="newEstado"
            value={estado}
            onChange={(e) => setNewEstado(e.target.value)}
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
          label="Endereço"
          placeholder={"Digite o endereço do consultório"}
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
          placeholder={"Coloque a Imagem de perfil do consultório"}
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
        <InputField
          label="Descrição"
          placeholder={"Digite o descrição do consultorio"}
          idInput="newDescricao"
          classNameDiv="inputDescricao"
          value={newDescricao}
          onChange={(e) => {
            setNewDescricao(e.target.value);
            isValid(e);
          }}
          onInvalid={(e) => isInvalid(e)}
          required
        />
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

export default ConsultorioUpdate;