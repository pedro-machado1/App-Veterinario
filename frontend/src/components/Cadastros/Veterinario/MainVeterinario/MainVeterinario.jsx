
import "./MainVeterinario.css";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShowVeterinario from "../ShowVeterinario/ShowVeterinario/ShowVeterinario";

const MainVeterinario = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [params] = useSearchParams() 

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
      var consultorioId = params.get("consultorioId")
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
  }, [showMore]);

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
            <button className="Edit" onClick={() => showMoreToggle(vet.id)}>
              Ver Mais
            </button>
            {showMore === vet.id && <ShowVeterinario
            onClose={() => setShowMore(false)}
            veterinarioId={vet.id}
            />
            }
          </div>
        ))}
      </div>
      
      {isLoading && <LoadingSpin />}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default MainVeterinario;