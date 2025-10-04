import "./ShowVeterinario.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import VeterinarioUpdate from "../VeterinarioUpdate/VeterinarioUpdate.jsx";
import notLogin from "../../../../assets/images/notLogin.png"

const ShowVeterinario = ({ 
  onClose,
  veterinarioId 
}) => {
  const [veterinario, setVeterinario] = useState(null);
  const [newImagem, setImagem] = useState(null)
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = import.meta.env.VITE_API_URL;

  function maskCpf(value) {
        try { 
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }catch(err) {
            return value
        }

    }

    function maskPhone(value) {
        try { 
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
        }catch(err) {
            return value
        }
    }

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

        const imagem = await axios.get(
          `${apiUrl}/api/veterinario/${veterinarioId}/imagem`, {
          responseType: 'blob'
        }
        )
        const imageUrl = URL.createObjectURL(imagem.data);
        setImagem(imageUrl);
        setSuccess("Dados do veterinário e imagem carregados com sucesso!");

      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    fetchVeterinario();
  }, [veterinarioId]);

  return (
    <div className="veterinario-container">
      <div className="presentVeterinarioContainer">
        {newImagem ? (
          <img src={newImagem} alt={`Foto de ${veterinario?.nome}`} className="veterinario-image" />
        ) : (
          <img src={notLogin} className="veterinario-image" />
        )}
        <div className="griditens">
          <div className="item">
            <p>
              <strong>CPF:</strong> {maskCpf(veterinario?.cpf) || "CPF não encontrado"}
            </p>
          </div>
          <div className="item">
            <p>
              <strong>CRVM:</strong> {veterinario?.crvm || "CRVM não encontrado"}
            </p>
          </div>
          <div className="item">
            <p>
              <strong>Estado:</strong> {veterinario?.estado || "estado não encontrado"}
            </p>
          </div>
          <div className="item">
            <p>
              <strong>Telefone:</strong>{" "}
              {maskPhone(veterinario?.telefone) || "Telefone não encontrado"}
            </p>
          </div>
          <div className="item full">
            <p>
              <strong>Endereço:</strong>{" "}
              {veterinario?.endereco || "Endereço não encontrado"}
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="fecharCerto"
        onClick={onClose}>
        Fechar
      </button>

      {isLoading && <LoadingSpin />}
      {error && <div className="error">{error}</div>}
    </div>
  );
};

export default ShowVeterinario;

