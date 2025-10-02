import "./ConsultorioEditClientes.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShowCliente from "../../Cliente/ShowCliente/ShowCliente";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";

const ConsultorioEditClientes = ({ 
    consultorioId,
    onClose
}) => {

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(null)
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(null);
  const [error, setError] = useState(null);

   const showConfirmationToggle = (animalId) => {
        if (showMore == animalId) {
            setShowConfirmation(null)
        }
        else {
            setShowConfirmation(animalId)
        }
    }

  const showMoreToggle = (clienteId) => {
    if (showMore === clienteId) {
      setShowMore(null);
    } else {
      setShowMore(clienteId);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      setIsLoading(true)
      setError(null);
      try {
          const response = await axios.get(`${apiUrl}/api/consultorio/${consultorioId}/cliente`);
          console.log(response.data)
        if (response.data.content.length === 0) {
          setError("Você não possui nenhum cliente cadastrado");
        } else {
          setClientes(response.data.content);
        }
      }catch (err) {
        setError("Erro ao carregar os clientes");
      }
      setIsLoading(false);
    };

    fetchClientes();
  }, [showMore, consultorioId]);

  const handleDelete = async (clienteId) => {
    setIsLoading(true)
    try{
      const response = await axios.delete(`${apiUrl}/api/consultorio/${consultorioId}/removecliente/${clienteId}`)
      setClientes((prev) => prev.filter((cliente) => cliente.id !== clienteId));
      console.log(response.data)
    }catch(err){
      setError("Erro ao Deletar esse Cliente do seu Consultorio")
    }
    setIsLoading(false)
  }
  
  return (
    <div className="main-cliente-container">
      
      <h1>Veterinários</h1>
      
      <div className="displayDeClientes">
        {clientes.map((consultorio) => (
          <div key={consultorio.id} className="Cliente">
            <p>
              <strong>Nome:</strong> {consultorio.nome || "Erro: nome não encontrado"}
            </p>
            <p>
              <strong>CPF:</strong> {consultorio.cpf || "Erro: CPF não encontrado"}
            </p>
            <p>
              <strong>CRVM:</strong> {consultorio.crvm || "Erro: CRVM não encontrado"}
            </p>
            <button className="Edit" 
            onClick={() => showMoreToggle(consultorio.id)}
            >
              Ver Mais
            </button>
            <button className="deletar" 
            onClick={() => showConfirmationToggle(consultorio.id)}
            >
                Deletar
            </button>
            {showMore === consultorio.id && <ShowCliente
            onClose={() => setShowMore(false)}
            clienteId={consultorio.id}
            />
            }
          </div>
        ))}
      </div>
      <button 
        className="AddCliente"
      >
        Adicionar Veterinário
      </button>
      <button 
        className="Fechar"
        onClick={onClose}
      >
        Fechar Essa Janela
      </button>
            { showConfirmation &&  
            <div className="overlay">
                <div className="confirmationContainer">
                <h2>
                    Você quer deletar esse animal? 
                </h2>
                <div className="botoesConfirmation">
                    <button className = "confirmation" onClick={() => 
                        {
                            handleDelete(showConfirmation)
                            setShowConfirmation(null)
                        }}>
                        Confirmar
                    </button>
                    <button className= "cancelar" onClick={() => setShowConfirmation(null)}>
                        Cancelar
                    </button>
                </div>
                </div>
            </div>
            }
      {isLoading && <LoadingSpin />}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );


}

export default ConsultorioEditClientes