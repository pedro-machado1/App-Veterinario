import "./UserProfile.css"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClienteUpdate from "../../components/Cadastros/Cliente/ClienteUpdate/ClienteUpdate";
import LoadingSpin from "../../components/Extras/LoadingSpin/LoadingSpin";
import axios from "axios";
import ConsultorioUpdate from "../../components/Cadastros/Consultorio/ConsultorioUpdate/ConsultorioUpdate";
import VeterinarioUpdate from "../../components/Cadastros/Veterinario/VeterinarioUpdate/VeterinarioUpdate";
import ConsultorioEditVeterinario from "../../components/Cadastros/Consultorio/ConsultorioEditVeterinarios/ConsultorioEditVeterinarios";
import MainConsultaCliente from "../../components/Cadastros/Consulta/MainConsulta/MainConsultaCliente/MainConsultaCliente";
import notLogin from "../../assets/images/notLogin.png"
import MainConsultaVeterinario from "../../components/Cadastros/Consulta/MainConsulta/MainConsultaVeterinario/MainConsultaVeterinario";
import MainClienteAdmin from "../../components/Cadastros/Cliente/MainCliente/MainClienteAdmin/MainClienteAdmin";


const UserProfile = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()

  const [imagem, setImagem] = useState(null)
  const [Error, setError] = useState(null)

  const [showConsultasVeterinario, setshowConsultasVeterinarios] = useState(false)
  const [showCliente, setShowCliente] = useState(false)
  const [showConsultorio, setShowConsultorio] = useState(false)
  const [showNovoConsultorio, setshowNovoConsultorio] = useState(false)
  const [showConsultasCliente, setShowConsultasCliente] = useState(false)
  const [showEditVeterinario, setShowEditVeterinario] = useState(false)
  const [showEditCliente, setShowEditCliente] = useState(false)
  const [showVeterinario, setShowVeterinario] = useState(false)

  const [hasCliente, setHasClient] = useState(null)
  const [hasConsultorio, setHasConsultorio] = useState(null)
  const [hasVeterinario, setHasVeterinario] = useState(null)
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const toggleEditVeterinario = () => {
    setShowEditVeterinario((prev) => !prev)
  }
  
  const toggleEditCliente = () => {
    setShowEditCliente((prev) => !prev)
  }

  const toggleConsultasVeterinario = () => {
    setshowConsultasVeterinarios((prev) => !prev)
  }

  const toggleConsultasCliente = () => {
    setShowConsultasCliente((prev) => !prev)
  }

  const toggleNovoConsultorio = () => {
    setshowNovoConsultorio((prev) => !prev)
  }

  const toggleConsultorio = () => {
    setShowConsultorio((prev) => !prev)
  }
  const toggleCliente = () => {
    setShowCliente((prev) => !prev)
  }
  const toggleVeterinario = () => {
    setShowVeterinario((prev) => !prev)
  }

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "Data de nascimento não encontrado";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    setHasClient(false)
    setHasConsultorio(false)
    setHasVeterinario(false)
    setLoading(true);

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/authentication`,
          );
        if (response.data.cliente) {
          setNewUser(response.data);
          console.log(response.data);
          setHasClient(true)
          const imagem = await axios.get(
            `${apiUrl}/api/cliente/${response.data.cliente.id}/imagem`, {
            responseType: 'blob'
          }
          )
          const imageUrl = URL.createObjectURL(imagem.data);
          setImagem(imageUrl);

        }
        if (response.data.consultorio) {
          setNewUser(response.data);
          console.log(response.data);
          setHasConsultorio(true)

          const imagem = await axios.get(
            `${apiUrl}/api/consultorio/${response.data.consultorio.id}/imagem`, {
            responseType: 'blob'
          }
          )
          const imageUrl = URL.createObjectURL(imagem.data);
          setImagem(imageUrl);

        }
        if (response.data.veterinario) {
          setNewUser(response.data);
          console.log(response.data);
          setHasVeterinario(true)

          const imagem = await axios.get(
            `${apiUrl}/api/veterinario/${response.data.veterinario.id}/imagem`, {
            responseType: 'blob'
          }
          )
          const imageUrl = URL.createObjectURL(imagem.data);
          setImagem(imageUrl);

        }

      } catch (err) {
        setError("Não foi possível carregar o perfil do utilizador.");
        console.error("Erro na requisição:", err);
        setImagem(null)
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [showCliente, showConsultorio, showVeterinario]);

  if (loading) {
    return <LoadingSpin />;
  }

  return (
    <div className="userContainer">

      {hasCliente && (
        <div className="ClienteContainer">
          {imagem ? (
            <img src={imagem} alt={`Foto de ${newUser?.cliente?.nome}`} className="cliente-image" />
          ) : (
            <img src={notLogin} className="cliente-image" />
          )}
          <p className="text-gray-600">
            E-mail: {newUser?.email || "E-mail não encontrado"}
          </p>

          <p className="text-gray-600">
            CPF: {newUser?.cliente?.cpf || "CPF não encontrado"}
          </p>
          <p className="text-gray-600">
            Data de Nascimento: {formatDateForDisplay(newUser?.cliente?.dataDeNascimento) || "Data de nascimento não encontrado"}
          </p>
          <p className="text-gray-600">
            Telefone: {newUser?.cliente?.telefone || "Telefone não encontrado"}
          </p>
          <p className="text-gray-600">
            Endereço: {newUser?.cliente?.endereco || "Endereço não encontrado"}
          </p>
          <p className="text-gray-600">
            Primeiro Acesso: {newUser?.cliente?.dataDeCriacao || "Primeiro Acesso não encontrado"}
          </p>
          <button
            onClick={toggleConsultasCliente}
          >
            Ver Consultas
          </button>
          <button
            onClick={toggleCliente}
            >
            Editar Informações
          </button>
          <button
            type="buttom"
            className="editAnimal"
            onClick={() => navigate("/animal")}
            >
            Editar os animais
          </button>
          {showCliente &&
            <div className="overlay">
              <ClienteUpdate
                id={newUser.cliente.id}
                name={newUser.cliente.nome}
                cpf={newUser.cliente.cpf}
                phone={newUser.cliente.telefone}
                dataDeNascimento={newUser.cliente.dataDeNascimento}
                endereco={newUser.cliente.endereco}
                onClose={() => setShowCliente(false)}
                />
            </div>
          }
          {showConsultasCliente &&
            <MainConsultaCliente
              onClose={() => setShowConsultasCliente(false)}
            />
          }
        </div>
      )}

      {hasConsultorio && (
        <div className="ConsultorioContainer">
          {imagem ? (
            <img src={imagem} alt={`Foto de ${newUser?.consultorio?.nome}`} className="consultorio-image" />
          ) : (
            <img src={notLogin} className="consultorio-image" />
          )}

          <p className="text-gray-600">
            E-mail: {newUser?.email || "E-mail não encontrado"}
          </p>
          <p className="text-gray-600">
            Telefone: {newUser?.consultorio?.telefone || "Telefone não encontrado"}
          </p>
          <p className="text-gray-600">
            Endereço: {newUser?.consultorio?.endereco || "Endereço não encontrado"}
          </p>
          <p className="text-gray-600">
            Endereço: {newUser?.consultorio?.estado || "Estado não encontrado"}
          </p>
          <p className="text-gray-600">
            Descrição: {newUser?.consultorio?.descricao || "Descrição não encontrada"}
          </p>
          <p className="text-gray-600">
            Data de Fundação: {formatDateForDisplay(newUser?.consultorio?.dataDeFundacao) || "Date de Fundação não encontrado"}
          </p>
          <p className="text-gray-600">
            Data de Cadastro: {formatDateForDisplay(newUser?.consultorio?.dataDeCadastro) || "Primeiro Acesso não encontrado"}
          </p>
          <button
            onClick={toggleConsultorio}
          >
            Editar Informações
          </button>
          <button
            onClick={toggleEditVeterinario}
          >
            Gerencinar os veterinarios do Consultorio
          </button>
          <button
            onClick={toggleEditCliente}
          >
            Gerenciar clientes
          </button>
          {showConsultorio &&
            <div className="overlay">
              <ConsultorioUpdate
                id={newUser.consultorio.id}
                name={newUser.consultorio.nome}
                phone={newUser.consultorio.telefone}
                dataDeFundacao={newUser.consultorio.dataDeFundacao}
                endereco={newUser.consultorio.endereco}
                estado={newUser.consultorio.estado}
                descricao={newUser.consultorio.descricao}
                onClose={() => setShowConsultorio(false)}
              />
            </div>
          }
          {showEditVeterinario &&
            <div className="overlay">
              <ConsultorioEditVeterinario
                consultorioId={newUser.consultorio.id}
                onClose={() => setShowEditVeterinario(false) }
              />
            </div>
          }
          { showEditCliente && 
            <div className="overlay">
              <MainClienteAdmin
                consultorioId={newUser.consultorio.id}
                onClose={() => setShowEditCliente(false)}              
              />
            </div>

          }
        </div>
      )}
      {hasVeterinario && (
        <div className="VeterinarioContainer">
          {imagem ? (
            <img src={imagem} alt={`Foto de ${newUser?.veterinario?.nome}`} className="veterinario-image" />
          ) : (
            <img src={notLogin} className="veterinario-image" />
          )}
          <p>
            E-mail: {newUser?.email || "E-mail não encontrado"}
          </p>
          <p>
            CPF: {newUser?.veterinario?.cpf || "CPF não encontrado"}
          </p>
          <p>
            CRVM: {newUser?.veterinario?.crvm || "CRVM não encontrado"}
          </p>
          <p>
            Data de Nascimento: {newUser?.veterinario?.dataDeNascimento || "Data de fundação não encontrada"}
          </p>
          <p>
            Estado: {newUser?.veterinario?.estado || "Estado não encontrado"}
          </p>
          <p>
            Telefone: {newUser?.veterinario?.telefone || "Telefone não encontrado"}
          </p>
          <p>
            Endereço: {newUser?.veterinario?.endereco || "Endereço não encontrado"}
          </p>
          <button
            className="EditarVeterinario"
            onClick={toggleVeterinario}
          >
            Editar Informações
          </button>

          {/* nao feito */}
          <button
            className="novoConsultorio"
            onClick={toggleNovoConsultorio}
          >
            Novo Consultorio
          </button>
          
          <button
            className="consulta"
            onClick={toggleConsultasVeterinario}
          >
            Mostrar consultas
          </button>
          {showVeterinario &&
            <div className="overlay">
              <VeterinarioUpdate
                id={newUser.veterinario.id}
                name={newUser.veterinario.nome}
                cpf={newUser.veterinario.cpf}
                crvm={newUser.veterinario.crvm}
                estado={newUser.veterinario.estado}
                phone={newUser.veterinario.telefone}
                dataDeNascimento={newUser.veterinario.dataDeNascimento}
                endereco={newUser.veterinario.endereco}
                descricao={newUser.veterinario.descricao}
                onClose={() => setShowVeterinario(false)}
              />
            </div>
          }
          {showConsultasVeterinario && (
            <MainConsultaVeterinario
              onClose={() => setshowConsultasVeterinarios(false)}
            />
          )}
        </div>
      )}
      {!hasCliente && !hasConsultorio && !hasVeterinario && (
        <div>
          <h1 onClick={() => navigate("/newCliente")}> 
            Você precisar registrar suas informações pessoais
            </h1>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
