// não funciona ainda devido ao fato do back do primeiro acesso do veterinario ao frontend n esta pronto


import "./MainVeterinario.css";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import SendEmailVeterinario from "../RegisterVeterinario/SendEmailVeterinario";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const MainVeterinario = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const location = useLocation();
  const consultorioId = location.state?.consultorioId;

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
        console.log("dfsasd")
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
  }, [showMore]);

  return (
    <div className="main-veterinario-container">
      
      <h1>Veterinários</h1>
      <button
      onClick={() => navigate("/sendVeterinario")}
      > Cadastrar animais 
      </button>
      
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
              <strong>CRVM:</strong> {vet.CRVM || "Erro: CRVM não encontrado"}
            </p>
            <button className="Edit" onClick={() => showMoreToggle(vet.id)}>
              Ver Mais
            </button>
            {showMore === vet.id && (
              <div className="veterinario-details">
                <p>
                  <strong>Email:</strong> {vet.email || "Não informado"}
                </p>
                <p>
                  <strong>Telefone:</strong> {vet.telefone || "Não informado"}
                </p>
                <p>
                  <strong>Endereço:</strong> {vet.endereco || "Não informado"}
                </p>
                <button onClick={() => setShowMore(null)}>Fechar</button>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {isLoading && <LoadingSpin />}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default MainVeterinario;