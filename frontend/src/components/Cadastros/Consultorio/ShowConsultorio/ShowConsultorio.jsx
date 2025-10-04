import "./ShowConsultorio.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import { useNavigate } from "react-router-dom";
import notLogin from "../../../../assets/images/notLogin.png"


const ShowNewConsultorio = ({
    onClose,
    consultorioId,
}) => {

    const [newConsultorio, setNewConsultorio] = useState(null)
    const [newImagem, setImagem] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate("/veterinarios")

    useEffect(() => {
        const asyncFunction = async () => {
            if (!consultorioId) console.log("Erro na inicialização");

            try {
                const response = await axios.get(`${apiUrl}/api/consultorio/${consultorioId}`)
                console.log(response.data)
                setNewConsultorio(response.data)

                const imagem = await axios.get(
                    `${apiUrl}/api/consultorio/${consultorioId}/imagem`, {
                    responseType: 'blob'
                }
                )
                const imageUrl = URL.createObjectURL(imagem.data);
                setImagem(imageUrl);
                setSuccess("Dados do veterinário e imagem carregados com sucesso!");


            } catch (err) {
                console.log(err)
                setError("Erro no get do animal")
            }
            setIsLoading(false)
        }

        asyncFunction()
    }, [consultorioId])

    return (
        <div className="animal-container">
            <div className="consultorioCard">
                {newImagem ? (
                    <img src={newImagem} alt={`Foto de ${newConsultorio?.nome}`} className="consultorio-image" />
                ) : (
                    <img src={notLogin} className="consultorio-image" />
                )}
                <p>
                    Endereço: {newConsultorio?.endereco || "Endereço não encontrada"}
                </p>
                <p>
                    Telefone: {newConsultorio?.telefone || "Telefone não encontrado"}
                </p>
                <p>
                    Dta de Fundação: {newConsultorio?.dataDeFundacao || "Data de fundação não encontrada"}
                </p>
                <p>
                    Data de Cadastro: {newConsultorio?.dataDeCadastro || "Data de cadastro não encontrada"}
                </p>
                <p>
                    Descrição: {newConsultorio?.descricao || "Descrição não encontrado"}
                </p>
                <p>
                    Estado: {newConsultorio?.estado || "Estado não encontrado"}
                </p>

                <div className="botoesContainer">
                    <button
                        type="button"
                        className="verMais"
                        onClick={() => navigate(`/veterinario?consultorioId=${consultorioId}`,
                        )}>
                        Ver Veterinários
                    </button>
                    <button
                        type="button"
                        className="fechar"
                        onClick={onClose}>
                        Fechar
                    </button>
                </div>
            </div>
            {isLoading && <LoadingSpin />}
        </div>
    );
};

export default ShowNewConsultorio;