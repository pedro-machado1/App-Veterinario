import "./MainConsultorio.css"
import ShowConsultorio from "../ShowConsultorio/ShowConsultorio"
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Security/Context/AuthContext";
import { useEffect, useState, useRef } from "react";
import notLogin from "../../../../assets/images/notLogin.png"

const MainConsultorio = () => {

    const apiUrl = import.meta.env.VITE_API_URL;


    const [newConsultorio, setNewConsultorio] = useState([])
    const [IsLoading, setIsLoading] = useState(true)
    const [newImage, setNewImage] = useState("")
    const [show, setShow] = useState(false)
    const [showMore, setShowMore] = useState(null)
    const [searchCpf, setSearchCpf] = useState("");
    const [Error, setError] = useState(null)

    const showMoreToggle = (consultorioid) => {
        if (showMore == consultorioid) {
            setShowMore(null)
        }
        else {
            setShowMore(consultorioid)
        }
    }


    const asyncFunction = async () => {
        let response
        setIsLoading(true)
        setError(null)
        let url = `${apiUrl}/api/consultorio`
        if (searchCpf != "") {
            url += `?estado=${searchCpf}`
            response = await axios.get(url)
        }
        else {
            response = await axios.get(url)
        }
        if (response.data.content.length == 0) {
            setError("Você não possui nenhum consultorio cadastrado")
            setNewConsultorio([]);
            console.log("Você não possui nenhum consultorio cadastrado ")
        }
        else {
            console.log(response.data.content)
            const consultorio = response.data.content
            const consultorioComImagens = await Promise.all(consultorio.map(async (consultorio) => {
                try {
                    const imageResponse = await axios.get(`${apiUrl}/api/consultorio/${consultorio.id}/imagem`,
                        {responseType: 'blob'}
                    );  
                    const image = URL.createObjectURL(imageResponse.data)
                    console.log(consultorio + " " + imageResponse.data)
                    return { ...consultorio, url: image};
                } catch (error) {
                    return { ...consultorio, url: null };
                }
            }))
            setNewConsultorio(consultorioComImagens)
            console.log(consultorioComImagens)
        }
        setIsLoading(false)
    }


        useEffect(() => {
            asyncFunction()
        }, [show, searchCpf])

        const navigate = useNavigate();

        return (
            <div>
                <button className="botaoCadastrarConsultorio" onClick={() => { navigate("/registerConsultorio") }}>
                    Cadastrar Consultório
                </button>
                <div className="inputEstado">
                    <label htmlFor="newEstado">Estado</label>
                    <select
                        placeholder="Search by CPF"
                        value={searchCpf}
                        onChange={(e) => setSearchCpf(e.target.value)}
                    >
                        <option value="" disabled>
                            Selecione...
                        </option>
                        <option value="AC">Acre</option>
                        <option value="AM">Amapá</option>
                        <option value="AL">Alagoas</option>
                        <option value="AM">Amazonas</option>
                        <option value="BA">Bahia</option>
                        <option value="CE">Ceará</option>
                        <option value="DF">Distrito Federal</option>
                        <option value="ES">Espírito Santo</option>
                        <option value="GO">Goiás</option>
                        <option value="MA">Maranhão</option>
                        <option value="MG">Mato Grosso</option>
                        <option value="MS">Mato Grosso do Sul</option>
                        <option value="MG">Minas Gerais</option>
                        <option value="PA">Pará</option>
                        <option value="PB">Paraíba</option>
                        <option value="PR">Paraná</option>
                        <option value="PE">Pernambuco</option>
                        <option value="PI">Piauí</option>
                        <option value="RJ">Rio de Janeiro</option>
                        <option value="RN">Rio Grande do Norte</option>
                        <option value="RS">Rio Grande do Sul</option>
                        <option value="RO">Rondônia</option>
                        <option value="RR">Roraima</option>
                        <option value="SC">Santa Catarina</option>
                        <option value="SP">São Paulo</option>
                        <option value="SE">Sergipe</option>
                        <option value="TO">Tocantins</option>
                    </select>
                </div>

                <h1>
                    Consultórios
                </h1>
                <div className="displayDeConsultorios">
                    {newConsultorio.map((consultorio) => (
                        <div key={consultorio.id} className="Consultorio"s>
                            {consultorio.imagem ? (
                                <img src={consultorio.url} alt={`Foto de ${consultorio.nome}`} className="consultorio-image" />
                            ) : (
                                <img src={notLogin} className="consultorio-image" />
                            )}
                            <p>
                                Nome: {consultorio.nome || "Erro nome não encontrado"}
                            </p>
                            <p>
                                Especie: {consultorio.endereco || "Erro endereço não encontrada"}
                            </p>
                            <button
                                className="Edit"
                                onClick={() => showMoreToggle(consultorio.id)}
                            >
                                Ver Mais
                            </button>
                            {showMore == consultorio.id &&
                                <ShowConsultorio
                                    onClose={() => setShowMore(null)}
                                    consultorioId={consultorio.id}
                                />
                            }`
                        </div>
                    ))}
                </div>
                {IsLoading && <LoadingSpin />}
                {Error && <div style={{ color: "red" }}>{Error}</div>}

            </div>
        )
    }

export default MainConsultorio;