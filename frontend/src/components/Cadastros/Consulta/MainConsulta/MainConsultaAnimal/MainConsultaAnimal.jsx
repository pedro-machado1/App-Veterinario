import "./MainConsultaAnimal.css";
import axios from "axios";
import LoadingSpin from "../../../../Extras/LoadingSpin/LoadingSpin";
import { useEffect, useState } from "react";
import ShowConsulta from "../../ShowConsulta/ShowConsulta";

const MainConsultaAnimal = ({
    animalId,
    onClose
}) => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [consultas, setConsultas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(null);
  const [error, setError] = useState(null);

  const showMoreToggle = (consultaId) => {
        if (showMore === consultaId) {
            setShowMore(null);
        } else {
            setShowMore(consultaId);
        }
  };

  useEffect(() => {
    const fetchConsultas = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${apiUrl}/api/animal/${animalId}/consulta`
        );
        const content = response.data?.content ;
        console.log(response.data.content)
        if (content.length === 0) {
          setConsultas([]);
          setError("Nenhuma consulta encontrada para este animal.");
        } else {
          setConsultas(content);
          setError(null);
        }
      } catch (err) {
        console.error(err);
        setConsultas([]);
        setError("Erro ao carregar as consultas.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultas();
  }, [showMore]);

  return (
    <div className="main-consulta-container">

      {consultas.length > 0 ? (
        <div className="displayDeConsultas">
          {consultas.map((c) => (
            <div key={c.id} className="ConsultaCard">
              <div className="conteudoInfo">
                <p>{c.titulo || "Consulta sem título"}</p>
                
                <p>
                  <strong>Data:</strong>
                  <span className="dataInfo">
                    {new Date(c.dataCriacao).toLocaleDateString("pt-BR")}
                  </span>
                </p>

                <p>
                  <strong>Veterinário:</strong> {c.veterinario || "Não informado"}
                </p>

                <p>
                  <strong>Descrição:</strong> {c.descricao ? c.descricao.substring(0, 50) + "..." : "Sem descrição"}
                </p>

                {c.status && (
                  <span className={`statusBadge status-${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                )}
              </div>

              <div className="botoesCarta">
                <button 
                  className="Edit" 
                  onClick={() => showMoreToggle(c.id)}
                >
                  Ver Detalhes
                </button>
                <button className="Deletar">
                  Deletar
                </button>
              </div>

              {showMore === c.id && (
                <ShowConsulta
                  onClose={() => setShowMore(null)}
                  consultaId={c.id}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        !isLoading && <div className="semConsultas">Nenhuma consulta registrada para este animal</div>
      )}

      {isLoading && <LoadingSpin />}
    </div>
  );
};

export default MainConsultaAnimal;
