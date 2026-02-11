import "./ClienteUpdate.css";
import { useState, useEffect } from "react";
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import { listarCidadesPorUf } from "../../../../services/locationService.js";

const ClienteUpdate = ({
  id,
  name,
  cpf,
  phone,
  dataDeNascimento,
  endereco,
  estadoUf,
  cidadeId, 
  onClose
}) => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [newName, setName] = useState(name || "");
  const [newCpf, setCpf] = useState(cpf || "");
  const [newPhone, setPhone] = useState(phone || "");
  const [newDataDeNascimento, setDataDeNascimento] = useState(dataDeNascimento || "");
  const [newEndereco, setEndereco] = useState(endereco || "");
  const [newEstado, setNewEstado] = useState(estadoUf || "");
  const [newCidade, setNewCidade] = useState(cidadeId || ""); 
  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    const loadInitialData = async () => {
      if (estadoUf) { // 
        setLoadingCidades(true);
        try {
          const cidadesList = await listarCidadesPorUf(estadoUf);
          setCidades(Array.isArray(cidadesList) ? cidadesList : []);
        } catch (err) {
          console.error("Erro ao carregar cidades:", err);
          setCidades([]);
        }
        setLoadingCidades(false);
      }
    };
    
    loadInitialData();
  }, []); 

  const CheckCpf = (CPF) => CPF.replace(/\D/g, "").length === 11;

  const CheckPhone = (PHONE) => {
    const digits = PHONE.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!CheckCpf(newCpf) || !CheckPhone(newPhone)) {
      setError("CPF ou Telefone inválido");
      return;
    }

    if (!newEstado || !newCidade) {
      setError("Selecione estado e cidade");
      return;
    }

    const newClient = {
      nome: newName,
      cpf: newCpf.replace(/\D/g, ""),
      telefone: newPhone.replace(/\D/g, ""),
      dataDeNascimento: newDataDeNascimento,
      endereco: newEndereco,
      estado: { codigoUf: ufToCodigo[newEstado] },
      cidade: { idIbge: newCidade } 
    };

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append(
        "cliente",
        new Blob([JSON.stringify(newClient)], {
          type: "application/json"
        })
      );

      await axios.put(`${apiUrl}/api/cliente`, formData);

      setSuccess("Cliente atualizado!");
      setTimeout(() => onClose(), 1500);

    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setError(err.response?.data?.message || "Erro ao atualizar");
    } finally {
      setIsLoading(false);
    }
  };

  const maskPhone = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  return (
    <div className="cliente-wrapper">
      <form className="cliente-form" onSubmit={handleUpdate}>

        <InputField label="Nome" value={newName} onChange={(e)=>setName(e.target.value)} required />
        <InputField label="CPF" value={newCpf} onChange={(e)=>setCpf(e.target.value)} required />
        <InputField label="Telefone" value={maskPhone(newPhone)} onChange={(e)=>setPhone(maskPhone(e.target.value))} required />

        <div className="custom-field">
          <label>Estado</label>
          <select value={newEstado} onChange={handleUfChange} required>
            <option value="">Selecione</option>
            {ufs.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        {newEstado && (
          <div className="custom-field">
            <label>Cidade</label>
            {loadingCidades ? (
              <p className="loading-text">Carregando cidades...</p>
            ) : (
              <select value={newCidade} onChange={(e)=>setNewCidade(e.target.value)} required>
                <option value="">Selecione</option>
                {cidades.map(city => (
                  <option key={city.idIbge} value={city.idIbge}>{city.nome}</option>
                ))}
              </select>
            )}
          </div>
        )}

        <InputField label="Data Nascimento" type="date" value={newDataDeNascimento} onChange={(e)=>setDataDeNascimento(e.target.value)} required />
        <InputField label="Endereço" value={newEndereco} onChange={(e)=>setEndereco(e.target.value)} required />

        <button className="btn-secondary" type="button" onClick={()=>navigate('/newAnimal')}>
          Adicionar Animal
        </button>

        <div className="feedback">
          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
        </div>

        <button type="submit" className="btn-primary">Atualizar</button>

      </form>

      <button className="ButtonFechar" onClick={onClose}>Fechar</button>
      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default ClienteUpdate;