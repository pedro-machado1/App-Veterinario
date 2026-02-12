import "./newConsultorio.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../../Extras/InputField/InputField.jsx";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import NewVeterinario from "../../Veterinario/newVeterinario/newVeterinario.jsx";
import { listarCidadesPorUf } from "../../../../services/locationService.js";

const NewConsultorio = () => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataDeFundacao, setDataDeFundacao] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [imagem, setImagem] = useState("");
  const [previewImg, setPreviewImg] = useState(null);

  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showVeterinario, setShowVeterinario] = useState(false);

  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const ufs = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  const ufToCodigo = {
    AC: 12, AL: 27, AP: 16, AM: 13, BA: 29, CE: 23, DF: 53,
    ES: 32, GO: 52, MA: 21, MT: 51, MS: 50, MG: 31, PA: 15,
    PB: 25, PR: 41, PE: 26, PI: 22, RJ: 33, RN: 24, RS: 43,
    RO: 11, RR: 14, SC: 42, SP: 35, SE: 28, TO: 17
  };

  const handleUfChange = async (e) => {
    const uf = e.target.value;
    setEstado(uf);
    setCidade("");
    setCidades([]);
    isValid(e);

    if (uf) {
      setLoadingCidades(true);
      try {
        const cidadesList = await listarCidadesPorUf(uf);
        setCidades(Array.isArray(cidadesList) ? cidadesList : []);
      } catch (err) {
        setCidades([]);
      }
      setLoadingCidades(false);
    }
  };

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
    setCep("");
    setDescricao("");
    setEstado("");
    setCidade("");
    setCidades([]);
    setImagem("");
    setPreviewImg(null);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!CheckDate(dataDeFundacao) || !CheckPhone(telefone)) return;
    if (!estado || !cidade) {
      setError("Selecione Estado e Cidade!");
      return;
    }
    if (!document.getElementById("formsNewConsultorio").reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }
    const newConsultorio = {
      nome,
      endereco,
      telefone : telefone.replace(/\D/g, ""),
      cep,
      descricao,
      dataDeFundacao,
      estado: { codigoUf: ufToCodigo[estado] },
      cidade: { idIbge: cidade }
    };
    setIsLoading(true);

    const formData = new FormData();
    const consultorioBlob = new Blob([JSON.stringify(newConsultorio)], { type: 'application/json' });
    formData.append("consultorio", consultorioBlob);
    if (imagem) {
      formData.append("imagem", imagem);
    }

    try {
      const response = await axios.post(`${apiUrl}/api/consultorio`, formData);
      handleReset();
      setSuccess("Consultório adicionado com sucesso!");
      setIsLoading(false);  
      navigate('/login')
    } catch (err) {
      setIsLoading(false);
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
          label="CEP"
          placeholder="Informe o CEP"
          name="cep"
          idInput="newCep"
          classNameDiv="inputCep"
          value={cep}
          onChange={(e)=> { setCep(e.target.value); isValid(e); }}
        />

        <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ flex: 0.5, display: 'flex', flexDirection: 'column' }}>
            <label>UF</label>
            <select
              value={estado}
              onChange={handleUfChange}
              required
              className="input-padrao"
              onInvalid={(e) => isInvalid(e)}
            >
              <option value="">UF</option>
              {ufs.map(uf => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label>Cidade</label>
            <select
              value={cidade}
              onChange={(e) => { setCidade(e.target.value); isValid(e); }}
              required
              disabled={!estado || loadingCidades}
              className="input-padrao"
              onInvalid={(e) => isInvalid(e)}
            >
              <option value="">{loadingCidades ? "Carregando..." : "Selecione"}</option>
              {cidades.map(city => (
                <option key={city.idIbge} value={city.idIbge}>{city.nome}</option>
              ))}
            </select>
          </div>
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
          <NewVeterinario onClose={() => setShowVeterinario(false)} />
        </div>
      )}
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default NewConsultorio;
