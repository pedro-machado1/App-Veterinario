import "./ShowConsultorio.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import ShowVeterinario from "../../Veterinario/ShowVeterinario/ShowVeterinario.jsx";
import notLogin from "../../../../assets/images/notLogin.png";

const ITEMS_PER_PAGE = 3;

const ShowNewConsultorio = ({ onClose, consultorioId }) => {
    const [consultorio, setConsultorio] = useState(null);
    const [imagem, setImagem] = useState(null);
    const [veterinarios, setVeterinarios] = useState([]);
    const [page, setPage] = useState(0);
    const [showLista, setShowLista] = useState(false);
    const [showMoreVet, setShowMoreVet] = useState(null);
    const [loading, setLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const c = await axios.get(`${apiUrl}/api/consultorio/${consultorioId}`);
                setConsultorio(c.data);

                const vets = await axios.get(
                    `${apiUrl}/api/consultorio/${consultorioId}/veterinario`
                );

                const vetsWithImg = await Promise.all(
                    vets.data.content.map(async (vet) => {
                        try {
                            const img = await axios.get(
                                `${apiUrl}/api/veterinario/${vet.id}/imagem`,
                                { responseType: "blob" }
                            );
                            return { ...vet, url: URL.createObjectURL(img.data) };
                        } catch {
                            return { ...vet, url: null };
                        }
                    })
                );

                setVeterinarios(vetsWithImg);

                const img = await axios.get(
                    `${apiUrl}/api/consultorio/${consultorioId}/imagem`,
                    { responseType: "blob" }
                );
                setImagem(URL.createObjectURL(img.data));
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [consultorioId]);

    if (loading) return <LoadingSpin />;

    const totalPages = Math.ceil(veterinarios.length / ITEMS_PER_PAGE);
    const vetsPage = veterinarios.slice(
        page * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
    );

    return (
        <div className="animal-container">
            <div className="consultorioCard">
                
                <div className="consultorioHeader">
                    <img
                        src={imagem || notLogin}
                        className="consultorio-image"
                        alt="Consultório"
                    />

                    <div className="consultorioInfo">
                        <p><strong>Endereço:</strong> {consultorio?.endereco}</p>
                        <p><strong>Telefone:</strong> {consultorio?.telefone}</p>
                        <p><strong>Fundação:</strong> {consultorio?.dataDeFundacao}</p>
                        <p><strong>Cadastro:</strong> {consultorio?.dataDeCadastro}</p>
                        <p><strong>Estado:</strong> {consultorio?.estado}</p>
                        <p><strong>Descrição:</strong> {consultorio?.descricao}</p>
                    </div>
                </div>


                {/* CARROSSEL */}
                {!showLista && veterinarios.length > 0 && (
                    <>
                        <div className="toggleVetsContainer">
                            <span>Carrossel</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={showLista}
                                    onChange={() => setShowLista(!showLista)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span>Lista</span>
                        </div>
                        <div className="carrosselContainer">
                            <button
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                            >
                                ❮
                            </button>

                            <div className="carrosselGrid">
                                {vetsPage.map((vet) => (
                                    <div key={vet.id} className="vetCard">
                                        <img src={vet.url || notLogin} />
                                        <p><strong>{vet.nome}</strong></p>
                                        <p>{vet.crvm}</p>
                                        <button
                                            onClick={() => setShowMoreVet(vet.id)}
                                        >
                                            Ver Mais
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                disabled={page === totalPages - 1}
                                onClick={() => setPage(page + 1)}
                            >
                                ❯
                            </button>
                        </div>
                    </>
                )}

                {/* lista */}
                {showLista && (
                    <>
                        <div className="toggleVetsContainer">
                            <span>Carrossel</span>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={showLista}
                                    onChange={() => setShowLista(!showLista)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span>Lista</span>
                        </div>

                        <div className="listaVetsContainer">
                            {veterinarios.map((vet) => (
                                <div key={vet.id} className="vetListItem">
                                    <p><strong>{vet.nome}</strong></p>
                                    <p>{vet.crvm}</p>
                                    <button onClick={() => setShowMoreVet(vet.id)}>
                                        Ver Mais
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <button className="fechar" onClick={onClose}>
                    Fechar
                </button>
            </div>

            {showMoreVet && (
                <div className="overlay">
                    <ShowVeterinario
                        veterinarioId={showMoreVet}
                        onClose={() => setShowMoreVet(null)}
                    />
                </div>
            )}
        </div>
    );
};

export default ShowNewConsultorio;
