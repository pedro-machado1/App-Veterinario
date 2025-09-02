import "./ShowVeterinario.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../../Extras/LoadingSpin/LoadingSpin.jsx";
import VeterinarioUpdate from "../../VeterinarioUpdate/VeterinarioUpdate.jsx";

const ShowVeterinario = ({ onClose, veterinarioId }) => {
  const [veterinario, setVeterinario] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchVeterinario = async () => {
      if (!veterinarioId) {
        console.log("Erro na inicialização");
        setError("Erro na inicialização");
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `${apiUrl}/api/veterinario/${veterinarioId}`
        );
        console.log(response.data);
        setVeterinario(response.data);
      } catch (err) {
        console.log(err);
        setError("Erro ao carregar o veterinário");
      }
      setIsLoading(false);
    };
    fetchVeterinario();
  }, [veterinarioId]);

  return (
    <div className="veterinario-container">
      <h2 className="title">
        {veterinario?.nome || "Nome não encontrado"}
      </h2>
      <div className="presentVeterinarioContainer">
        <p>
          <strong>CPF:</strong> {veterinario?.cpf || "CPF não encontrado"}
        </p>
        <p>
          <strong>CRVM:</strong> {veterinario?.crvm || "CRVM não encontrado"}
        </p>
        <p>
          <strong>Estado:</strong> {veterinario?.estado || "estado não encontrado"}
        </p>
        <p>
          <strong>Telefone:</strong>{" "}
          {veterinario?.telefone || "Telefone não encontrado"}
        </p>
        <p>
          <strong>Endereço:</strong>{" "}
          {veterinario?.endereco || "Endereço não encontrado"}
        </p>
      </div>
      <button 
      type="button" 
      className="fechar"
       onClick={onClose}>
        Fechar
      </button>
      
      {isLoading && <LoadingSpin />}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

export default ShowVeterinario;

