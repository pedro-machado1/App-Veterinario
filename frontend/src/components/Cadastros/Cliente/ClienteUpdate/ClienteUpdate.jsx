import "./ClienteUpdate.css";
import { useState, useEffect, useRef } from "react";
import InputField from "../../../Extras/InputField/InputField";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { listarCidadesPorUf } from "../../../../services/locationService.js";
import notLogin from "../../../../assets/images/notLogin.png";

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
  const fileInputRef = useRef(null);

  const [newName, setName] = useState(name || "");
  const [newCpf, setCpf] = useState(cpf || "");
  const [newPhone, setPhone] = useState(phone || "");
  const [newDataDeNascimento, setDataDeNascimento] = useState(dataDeNascimento || "");
  const [newEndereco, setEndereco] = useState(endereco || "");
  const [newEstado, setNewEstado] = useState(estadoUf || "");
  const [newCidade, setNewCidade] = useState(cidadeId || "");

  const [cidades, setCidades] = useState([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  const [newImagem, setImagem] = useState(null);
  const [previewImg, setPreviewImg] = useState(null);

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

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    setIsLoading(true);

    if (estadoUf) {
      await loadCities(estadoUf);
    }

    try {
      const imageResponse = await axios.get(
        `${apiUrl}/api/cliente/${id}/imagem`,
        { responseType: "blob" }
      );

      if (imageResponse.data.size > 0) {
        setPreviewImg(URL.createObjectURL(imageResponse.data));
      }
    } catch {}

    setIsLoading(false);
  };

  const loadCities = async (uf) => {
    setLoadingCidades(true);
    try {
      const list = await listarCidadesPorUf(uf);
      setCidades(Array.isArray(list) ? list : []);
    } catch {
      setCidades([]);
    }
    setLoadingCidades(false);
  };

  const handleUfChange = async (e) => {
    const uf = e.target.value;
    setNewEstado(uf);
    setNewCidade("");
    await loadCities(uf);
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagem(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

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
        new Blob([JSON.stringify(newClient)], { type: "application/json" })
      );

      if (newImagem) formData.append("imagem", newImagem);

      await axios.put(`${apiUrl}/api/cliente`, formData);

      setSuccess("Cliente atualizado!");
      setTimeout(() => onClose(), 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atualizar");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="clienteContainer">

      <h1 className="title">Atualizar Cliente</h1>

      <form onSubmit={handleUpdate} id="formsNewClient">

        {/* ===== IMAGEM ===== */}
        <div className="imagePreview" onClick={handleImageClick}>
          {previewImg ? (
            <img src={previewImg} alt="Preview" className="cliente-image" />
          ) : (
            <img src={notLogin} alt="Sem imagem" className="cliente-image" />
          )}

          <div>
            <p className="dragDropText">Clique para alterar imagem</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </div>
        </div>

        {/* ===== LINHA 1 ===== */}
        <div className="line1">
          <InputField label="Nome" value={newName} onChange={(e)=>setName(e.target.value)} required />
          <InputField label="CPF" value={newCpf} onChange={(e)=>setCpf(e.target.value)} required />
        </div>

        {/* ===== LINHA 2 ===== */}
        <div className="line2">
          <InputField label="Telefone" value={newPhone} onChange={(e)=>setPhone(e.target.value)} required />
          <InputField label="Data Nascimento" type="date" value={newDataDeNascimento} onChange={(e)=>setDataDeNascimento(e.target.value)} required />
        </div>

        {/* ===== LINHA 3 ===== */}
        <div className="line3">
          <InputField label="Endereço" value={newEndereco} onChange={(e)=>setEndereco(e.target.value)} required />

          <div className="inputEstado">
            <label>Estado</label>
            <select value={newEstado} onChange={handleUfChange} required>
              <option value="">Selecione...</option>
              {ufs.map(uf => <option key={uf}>{uf}</option>)}
            </select>
          </div>

          {newEstado && (
            <div className="inputCidade">
              <label>Cidade</label>

              {loadingCidades ? (
                <p className="loading-text">Carregando...</p>
              ) : (
                <select value={newCidade} onChange={(e)=>setNewCidade(e.target.value)} required>
                  <option value="">Selecione...</option>
                  {cidades.map(c => (
                    <option key={c.idIbge} value={c.idIbge}>{c.nome}</option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* ===== FEEDBACK ===== */}
        <div className="errorsOrSuccess">
          {error && <p style={{color:"red"}}>{error}</p>}
          {success && <p style={{color:"green"}}>{success}</p>}
        </div>

        {/* ===== BOTÕES ===== */}
        <div className="botoesPrincipais">
          <button type="submit" className="submit">Atualizar</button>
          <button type="button" className="cancelar" onClick={onClose}>Cancelar</button>
        </div>

      </form>

      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default ClienteUpdate;
