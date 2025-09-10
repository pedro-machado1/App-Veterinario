import "./ConsultorioEditVeterinarios.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShowVeterinario from "../../Veterinario/ShowVeterinario/ShowVeterinario/ShowVeterinario";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";

const ConsultorioEditVeterinario = ({ 
    consultorioId,
    onClose
}) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

  const [veterinarios, setVeterinarios] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(null);
  const [error, setError] = useState(null);

  const showMoreToggle = (veterinarioId) => {
    if (showMore === veterinarioId) {
      setShowMore(null);
    } else {
      setShowMore(veterinarioId);
    }
  };

  useEffect(() => {
    const fetchVeterinarios = async () => {
      setIsLoading(true)
      setError(null);
      try {
          const response = await axios.get(`${apiUrl}/api/consultorio/${consultorioId}/veterinario`);
          console.log(response.data)
        if (response.data.content.length === 0) {
          setError("Você não possui nenhum veterinário cadastrado");
        } else {
          setVeterinarios(response.data.content);
        }
      }catch (err) {
        setError("Erro ao carregar os veterinários");
      }
      setIsLoading(false);
    };

    fetchVeterinarios();
  }, [showMore, consultorioId]);

  const handleDelete = async (veterinarioId) => {
    setIsLoading(true)
    try{
      const response = await axios.delete(`${apiUrl}/api/consultorio/removeveterinario/${veterinarioId}`)
      setVeterinarios((prev) => prev.filter((veterinario) => veterinario.id !== veterinarioId));
      console.log(response.data)
    }catch(err){
      setError("Erro ao Deletar esse Veterinario do seu Consultorio")
    }
    setIsLoading(false)
  }
  
  return (
    <div className="main-veterinario-container">
      
      <h1>Veterinários</h1>
      
      <div className="displayDeVeterinarios">
        {veterinarios.map((vet) => (
          <div key={vet.id} className="Veterinario">
            <p>
              <strong>Nome:</strong> {vet.nome || "Erro: nome não encontrado"}
            </p>
            <p>
              <strong>CPF:</strong> {vet.cpf || "Erro: CPF não encontrado"}
            </p>
            <p>
              <strong>CRVM:</strong> {vet.crvm || "Erro: CRVM não encontrado"}
            </p>
            <button className="Edit" 
            onClick={() => showMoreToggle(vet.id)}
            >
              Ver Mais
            </button>
            <button className="deletar" 
            onClick={() => handleDelete(vet.id)}
            >
                Deletar
            </button>
            {showMore === vet.id && <ShowVeterinario
            onClose={() => setShowMore(false)}
            veterinarioId={vet.id}
            />
            }
          </div>
        ))}
      </div>
      <button 
        className="AddVeterinario"
        onClick={ () =>  navigate("/sendVeterinario")}
      >
        Adicionar Veterinário
      </button>
      <button 
        className="Fechar"
        onClick={onClose}
      >
        Fechar Essa Janela
      </button>
      {isLoading && <LoadingSpin />}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );


}

export default ConsultorioEditVeterinario