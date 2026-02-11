import "./ConsultorioUpdate.css";
import { useState, useEffect } from "react";
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { listarCidadesPorUf } from "../../../../services/locationService.js";

const ConsultorioUpdate = ({
  id,
  name,
  phone,
  dataDeFundacao,
  endereco,
  estado,
  descricao,
  cidade,
  onClose
}) => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const [newName, setName] = useState(name || "");
  const [newPhone, setPhone] = useState(phone || "");
  const [newDataDeFundacao, setDataDeFundacao] = useState(dataDeFundacao || "");
  const [newEndereco, setEndereco] = useState(endereco || "");
  const [newDescricao, setDescricao] = useState(descricao || "");

  const [newEstado, setNewEstado] = useState(estado?.uf || "");
  const [newCidade, setNewCidade] = useState(cidade?.id || "");

  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const ufs = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

  const carregarCidades = async (uf, manterCidade = false) => {
    if (!uf) return;

    setLoadingCidades(true);

    try {
      const cidadesList = await listarCidadesPorUf(uf);
      setCidades(Array.isArray(cidadesList) ? cidadesList : []);

      if (!manterCidade) {
        setNewCidade("");
      }
    } catch {
      setCidades([]);
    }

    setLoadingCidades(false);
  };

  const handleUfChange = async (e) => {
    const uf = e.target.value;
    setNewEstado(uf);
    await carregarCidades(uf);
  };

  useEffect(() => {
    if (newEstado) {
      carregarCidades(newEstado, true);
    }
  }, []);

  const CheckPhone = (PHONE) => {
    const digits = PHONE.replace(/\D/g, "");
    return digits.length === 10 || digits.length === 11;
  };

  const handleUpdate = async (e) => {

    e.preventDefault();

    if (!CheckPhone(newPhone)) {
      setError("Telefone inválido");
      return;
    }

    if (!newEstado || !newCidade) {
      setError("Selecione estado e cidade");
      return;
    }

    const UpdateConsultorio = {
      nome: newName,
      telefone: newPhone,
      dataDeFundacao: newDataDeFundacao,
      descricao: newDescricao,
      endereco: newEndereco,
      estado: {
        uf: newEstado
      },
      cidade: {
        id: Number(newCidade)
      }
    };

    try {

      setIsLoading(true);

      const formData = new FormData();

      formData.append(
        "consultorio",
        new Blob([JSON.stringify(UpdateConsultorio)], {
          type: "application/json"
        })
      );

      await axios.put(`${apiUrl}/api/consultorio`, formData, {
        withCredentials: true
      });

      setSuccess("Consultório atualizado!");
      onClose();

    } catch (err) {

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
    <div className="consultorio-container">
      <form onSubmit={handleUpdate}>

        <InputField
          label="Nome"
          value={newName}
          onChange={(e)=>setName(e.target.value)}
          required
        />

        <InputField
          label="Telefone"
          value={maskPhone(newPhone)}
          onChange={(e)=>setPhone(maskPhone(e.target.value))}
          required
        />

        <label className="selectLabel">
          Estado
          <select
            value={newEstado}
            onChange={handleUfChange}
            required
          >
            <option value="">Selecione</option>
            {ufs.map(uf => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </label>

        {newEstado && (
          <label className="selectLabel">
            Cidade

            {loadingCidades ? (
              <p>Carregando cidades...</p>
            ) : (
              <select
                value={newCidade}
                onChange={(e)=>setNewCidade(e.target.value)}
                required
              >
                <option value="">Selecione</option>

                {cidades.map(city => (
                  <option key={city.id} value={city.id}>
                    {city.nome}
                  </option>
                ))}

              </select>
            )}

          </label>
        )}

        <InputField
          label="Data Fundação"
          type="date"
          value={newDataDeFundacao}
          onChange={(e)=>setDataDeFundacao(e.target.value)}
          required
        />

        <InputField
          label="Endereço"
          value={newEndereco}
          onChange={(e)=>setEndereco(e.target.value)}
          required
        />

        <InputField
          label="Descrição"
          value={newDescricao}
          onChange={(e)=>setDescricao(e.target.value)}
          required
        />

        <div className="errorsOrSuccess">
          <p style={{color:"red"}}>{error}</p>
          <p style={{color:"green"}}>{success}</p>
        </div>

        <button type="submit" className="submit">
          Atualizar
        </button>

      </form>

      <button className="fechar" onClick={onClose}>
        Fechar
      </button>

      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default ConsultorioUpdate;
