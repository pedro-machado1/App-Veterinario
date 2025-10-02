import "./ShowCliente.css"
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import MainConsultaCliente from "../../Consulta/MainConsulta/MainConsultaCliente/MainConsultaCliente.jsx";
import notLogin from "../../../../assets/images/notLogin.png"

const ShowCliente = ({
    onClose,
    clienteId,
    userProfile
}) => {

    const [newCliente, setNewCliente] = useState(null)
    const [newImagem, setImagem] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
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
                const response = await axios.get(`${apiUrl}/api/cliente/${clienteId}`)
                console.log(response.data)
                setNewCliente(response.data)
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
            {userProfile == true &&
                <div>
                    <MainConsultaCliente

                    />
                </div>
            }
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