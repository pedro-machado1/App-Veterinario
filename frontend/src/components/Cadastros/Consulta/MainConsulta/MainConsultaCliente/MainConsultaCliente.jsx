import "./MainConsultaCliente.css";
import axios from "axios";
import LoadingSpin from "../../../../Extras/LoadingSpin/LoadingSpin";
import { useEffect, useState } from "react";
import ShowConsulta from "../../ShowConsulta/ShowConsulta";

const MainConsultaCliente = ({
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
          `${apiUrl}/api/cliente/consulta`
        );
        const content = response.data?.content ;
        console.log(response.data.content)
        if (content.length === 0) {
          setConsultas([]);
          setError("Nenhuma consulta encontrada para este cliente.");
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

      <h1>Consultas</h1>

      <div className="displayDeConsultas">
        {consultas.map((c) => (
          <div key={c.id} className="ConsultaCard">
            <p>
              <strong>Título:</strong> {c.titulo || "Título não informado"}
            </p>
            <p>
              <strong>Data:</strong> {c.dataCriacao || "Data não encontrada"}
            </p>

            <button className="Edit" onClick={() => showMoreToggle(c.id)}>
              Ver Mais
            </button>

            {showMore === c.id && (
              <ShowConsulta
                onClose={() => setShowMore(null)}
                consultaId={c.id}
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="Fechar"
        onClick={onClose}
      >
        Fechar
      </button>

      {isLoading && <LoadingSpin />}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default MainConsultaCliente;
