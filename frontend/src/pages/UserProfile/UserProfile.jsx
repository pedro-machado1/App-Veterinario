import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css"
import ClienteUpdate from "../../components/Cadastros/Cliente/ClienteUpdate";
import LoadingSpin from "../../components/Extras/LoadingSpin/LoadingSpin";
import axios from "axios";

const UserProfile = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()

  const [show, setShow] = useState(false)
  const [hasCliente, setHasClient] = useState(null)
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(true);


  const formatDateForDisplay = (dateStr) => { 
    if (!dateStr) return "Data de nascimento não encontrado";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/authentication`,
            {
            withCredentials: true,
        });
        if (!response.data.cliente){ 
          console.error("Você não possui nenhum animal cadastrado ")
          setHasClient(false)
        }
        setNewUser(response.data);
        console.log(response.data);
        setHasClient(true)
      } catch (err) {
        setError("Não foi possível carregar o perfil do utilizador.");
        console.error("Erro na requisição:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [show]);

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div>
      <h1 className="k">{newUser?.cliente?.nome}</h1>
      <p className="text-gray-600">
        E-mail: {newUser.email || "E-mail não encontrado"}
      </p>
      {hasCliente && (  
        <div>
        <p className="text-gray-600">
          CPF: {newUser.cliente.cpf || "CPF não encontrado"}
        </p>
        <p className="text-gray-600">
          Data de Nascimento: {formatDateForDisplay(newUser.cliente.dataDeNascimento) || "Data de nascimento não encontrado"}
        </p>
        <p className="text-gray-600">
          Telefone: {newUser.cliente.telefone || "Telefone não encontrado"}
        </p>
        <p className="text-gray-600">
          Endereço: {newUser.cliente.endereco || "Endereço não encontrado"}
        </p>
        <p className="text-gray-600">
          Primeiro Acesso: {newUser.cliente.dataDeCriacao || "Primeiro Acesso não encontrado"}
        </p>
      </div>
      )}
      {!hasCliente && (
        <div>
          <h1 onClick={navigate("/newCliente")}> Você precisar registrar suas informações pessoais</h1>
        </div>
      )
      }
      <button
        onClick={() => {
            if (show == true) setShow(false);
            else setShow(true);
          }
        }
      >
        Editar
      </button>
      <button
        type="buttom"
        onClick={() => navigate("/animal")}
      >
        Editar os animais
      </button>
      {show && 
      <div className="popUp">
        <ClienteUpdate
        name = {newUser.cliente.nome}
        cpf = {newUser.cliente.cpf}
        phone = {newUser.cliente.telefone}
        dataDeNascimento = {newUser.cliente.dataDeNascimento}
        endereco = {newUser.cliente.endereco}
        onClose = {() => setShow(false)}
        />
      </div>
      }
    </div>
  );
};

export default UserProfile;
