import { useState, useEffect } from "react";
import "./UserProfile.css"
import ClienteUpdate from "../../components/Cadastros/Cliente/ClienteUpdate";
import LoadingSpin from "../../components/Extras/LoadingSpin/LoadingSpin";
import axios from "axios";

const UserProfile = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [newName, setName] = useState("");
  const [newCpf, setCpf] = useState("");
  const [newPhone, setPhone] = useState("");
  const [newdataDeNascimento, setdataDeNascimento] = useState("");
  const [newEndereco, setEndereco] = useState("");
  const [newImagem, setImagem] = useState("");
  const [show, setShow] = useState(false)
  const [previewImg, setPreviewImg] = useState(null);
  const [Error, setError] = useState(null);
  const [Success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/authentication`,
            {
            withCredentials: true,
        });
        setNewUser(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Não foi possível carregar o perfil do utilizador.");
        console.error("Erro na requisição:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const HandleEdit = async (
    cpf,
    nome,
    telefone,
    dataDeNascimento,
    endereco
  ) => {
    const clienteid = newUser.cliente.id;
    const newClient = {
      nome: newName,
      cpf: parseInt(newCpf.replace(/\D/g, "")),
      telefone: parseInt(newPhone.replace(/\D/g, "")),
      dataDeNascimento: newdataDeNascimento,
      endereco: newEndereco,
      // imagem: newImagem,
    };

    if (!document.getElementById("formsNewClient")?.reportValidity()) {
      setError("Preencha todos os campos!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `${apiUrl}/api/cliente/${clienteid}`, 
        newClient
      );
      console.log("Updated Client:", response.data);
      setSuccess("Cliente atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      if (err.response?.data) {
        setError(`${err.response.data.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  }; 

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div>
      <h1 className="k">{newUser?.cliente?.nome}</h1>
      <p className="text-gray-600">
        E-mail: {newUser.email || "E-mail não encontrado"}
      </p>
      <p className="text-gray-600">
        CPF: {newUser.cliente.cpf || "CPF não encontrado"}
      </p>
      <p className="text-gray-600">
        Data de Nascimento: {newUser.cliente?.dataDeNascimento || "Data de nascimento não encontrado"}
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

      <button
        onClick={() => setShow(true)
        }
      >
        Editar
      </button>
      <button>
        Editar os animais
      </button>
      ({show && 
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
      })
    </div>
  );
};

export default UserProfile;
