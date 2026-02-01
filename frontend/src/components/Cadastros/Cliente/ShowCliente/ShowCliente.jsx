import "./ShowCliente.css"
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import MainConsultaCliente from "../../Consulta/MainConsulta/MainConsultaCliente/MainConsultaCliente.jsx";
import CreateConsultaModal from "../../Consulta/CreateConsultaModal/CreateConsultaModal.jsx";
import notLogin from "../../../../assets/images/notLogin.png"

const ShowCliente = ({
    onClose,
    clienteId,
    userProfile
}) => {

    const [newCliente, setNewCliente] = useState(null)
    const [newImagem, setImagem] = useState(null)
    const [newPermission, setPermission] = useState(false)
    const [Veterinario, setVeterinario] = useState(false)
    const [showCreateConsulta, setShowCreateConsulta] = useState(false)
    const [Error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;


    function maskCpf(value) {
        try { 
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        }catch(err) {
            return value
        }

    }

    function maskPhone(value) {
        try { 
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .slice(0, 15);
        }catch(err) {
            return value
        }
    }




    useEffect(() => {
        const asyncFunction = async () => {
            if (!clienteId) console.log("Erro na inicialização");

            try {
                const response = await axios.get(`
                    ${apiUrl}/api/cliente/${clienteId}`
                )
                setNewCliente(response.data)

                const verVeterinario= await axios.get(`${apiUrl}/api/auth/authentication`
                )


                if (verVeterinario.data?.veterinario) {
                    setVeterinario(true)
                    const permisssion = await axios.get(
                        `${apiUrl}/api/clienteVeterinario/existeCliente?clienteId=${clienteId}`
                    )
                    setPermission(permisssion.data)
                } 

                const imagem = await axios.get(
                    `${apiUrl}/api/cliente/${clienteId}/imagem`, {
                    responseType: 'blob'
                }
                )
                const imageUrl = URL.createObjectURL(imagem.data);
                setImagem(imageUrl);

            } catch (err) {
                console.log(err)
                setError("Erro no get do animal")
            }
            setIsLoading(false)
        }

        asyncFunction()
    }, [clienteId])

    return (
        <div className="animalContainer">
            <div className="presentAnimalContainer">
                {newImagem ? (
                    <img src={newImagem} alt={`Foto de ${newCliente?.nome}`} className="cliente-image" />
                ) : (
                    <img src={notLogin} className="cliente-image" />
                )}

                <p>
                    Endereço: {newCliente?.endereco || "Endereço não encontrada"}
                </p>
                <p>
                    CPF : {maskCpf(newCliente?.cpf) || "CPF não encontrada"}
                </p>
                <p>
                    Telefone: {maskPhone(newCliente?.telefone) || "Telefone não encontrado"}
                </p>
                <p>
                    Data de Fundação: {newCliente?.dataDeNascimento || "Data de nascimento não encontrada"}
                </p>
                <p>
                    Data de Cadastro: {newCliente?.dataDeCriacao || "Data de cadastro não encontrada"}
                </p>
            </div>
            { Veterinario == true && newPermission == false && (
                <h2>
                    Você não tem permissação para criar consultas
                </h2>
            )
            }
            { Veterinario == true && newPermission == true && (
                <button
                    className="criarConsultaBtn"
                    onClick={() => setShowCreateConsulta(true)}
                >
                    Criar Consulta
                </button>
            )

            }
            {userProfile == true &&
                <div>
                    <MainConsultaCliente

                    />
                </div>
            }
            {showCreateConsulta && (
                <div className="overlay">
                    <CreateConsultaModal
                        onClose={() => setShowCreateConsulta(false)}
                        clienteId={clienteId}
                        clienteNome={newCliente?.nome}
                    />
                </div>
            ) }
            <button
                type="buttom"
                className="fechar"
                onClick={onClose}>
                Fechar
            </button>
            {isLoading && <LoadingSpin />}
        </div>
    );


}

export default ShowCliente