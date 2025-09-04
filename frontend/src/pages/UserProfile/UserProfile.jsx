import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css"
import ClienteUpdate from "../../components/Cadastros/Cliente/ClienteUpdate/ClienteUpdate";
import LoadingSpin from "../../components/Extras/LoadingSpin/LoadingSpin";
import axios from "axios";
import ConsultorioUpdate from "../../components/Cadastros/Consultorio/ConsultorioUpdate/ConsultorioUpdate";
import VeterinarioUpdate from "../../components/Cadastros/Veterinario/VeterinarioUpdate/VeterinarioUpdate";
import ConsultorioEditVeterinario from "../../components/Cadastros/Consultorio/ConsultorioEditVeterinarios/ConsultorioEditVeterinarios";
import MainConsultaCliente from "../../components/Cadastros/Consulta/MainConsulta/MainConsultaCliente";
import notLogin from "../../assets/images/notLogin.png"

const UserProfile = () => {

  const apiUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate()

  const [imagem, setImagem] = useState(null)
  const [Error, setError] = useState(null)

  const [showCliente, setShowCliente] = useState(false)
  const [showConsultorio, setShowConsultorio] = useState(false)
  const [showNovoConsultorio, setshowNovoConsultorio] = useState(false)
  const [showConsultasCliente, setShowConsultasCliente] = useState(false)
  const [showEditVeterinario, setShowEditVeterinario] = useState(false)
  const [showVeterinario, setShowVeterinario] = useState(false)

  const [hasCliente, setHasClient] = useState(null)
  const [hasConsultorio, setHasConsultorio] = useState(null)
  const [hasVeterinario, setHasVeterinario] = useState(null)
  const [newUser, setNewUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const toggleEditVeterinario = () => {
    setshowNovoConsultorio((prev) => !prev)
  }

  const toggleConsultasCliente = () => {
    setShowConsultasCliente((prev) => !prev)
  }

  const toggleNovoConsultorio = () => {
    setShowEditVeterinario((prev) => !prev)
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
          {
            withCredentials: true,
          });
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
            `${apiUrl}/api/cliente/${response.data.veterinario.id}/imagem`, {
            responseType: 'blob'
          }
          )
          const imageUrl = URL.createObjectURL(imagem.data);
          setImagem(imageUrl);

        }

      } catch (err) {
        setError("Não foi possível carregar o perfil do utilizador.");
        console.error("Erro na requisição:", err);
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
    <div>

      {hasCliente && (
        <div>
          {imagem ? (
            <img src={imagem} alt={`Foto de ${newUser?.cliente?.nome}`} className="cliente-image" />
          ) : (
            <img src={notLogin} className="notFound-image" />
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
            Consultas
          </button>
          {showConsultasCliente &&
            <MainConsultaCliente
              onClose={() => setShowConsultasCliente(false)}
            />
          }
          <button
            onClick={toggleCliente}
          >
            Editar
          </button>
          <button
            type="buttom"
            onClick={() => navigate("/animal")}
          >
            Editar os animais
          </button>
          {showCliente &&
            <div className="popUpCliente">
              <ClienteUpdate
                id={newUser.cliente.id}
                name={newUser.cliente.nome}
                cpf={newUser.cliente.cpf}
                phone={newUser.cliente.telefone}
                dataDeNascimento={newUser.cliente.dataDeNascimento}
                endereco={newUser.cliente.endereco}
                imagem={newUser.cliente.imagem}
                onClose={() => setShowCliente(false)}
              />
            </div>
          }
        </div>
      )}

      {hasConsultorio && (
        <div>
          {imagem ? (
            <img src={imagem} alt={`Foto de ${newUser?.consultorio?.nome}`} className="consultorio-image" />
          ) : (
            <img src={notLogin} className="notFound-image" />
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
            Editar
          </button>
          <button
            onClick={toggleEditVeterinario}
          >
            Editar os veterinarios do Consultorio
          </button>
          {showConsultorio &&
            <div className="popUpConsultorio">
              <ConsultorioUpdate
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
            <div className="displayShowEditVeterinario">
              <ConsultorioEditVeterinario
                consultorioId={newUser.consultorio.id}
                onClose={() => { setShowEditVeterinario(false) }}
              />
            </div>
          }
        </div>
      )}
      {hasVeterinario && (
        <div>
          {imagem ? (
            <img src={imagem} alt={`Foto de ${newUser?.veterinario?.nome}`} className="veterinario-image" />
          ) : (
            <img src={notLogin} className="notFound-image" />
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
            Editar
          </button>
          <button
            className="novoConsultorio"
            onClick={toggleNovoConsultorio}
          >
            Novo Consultorio
          </button>
          {showVeterinario &&
            <div className="popUpConsultorio">
              <VeterinarioUpdate
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
          {/* // substituir */}
          {/* {showNovoConsultorio && 
            <div className="displayNovoConsultorio">
              <MainConsultorio/>
            </div>

          } */}
        </div>
      )}
      {!hasCliente && !hasConsultorio && !hasVeterinario && (
        <div>
          <h1 onClick={() => navigate("/newCliente")}> Você precisar registrar suas informações pessoais</h1>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
