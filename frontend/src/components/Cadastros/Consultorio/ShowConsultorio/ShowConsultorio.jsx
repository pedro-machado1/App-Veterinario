import "./ShowConsultorio.css";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import ShowVeterinario from "../../Veterinario/ShowVeterinario/ShowVeterinario.jsx";
import notLogin from "../../../../assets/images/notLogin.png";

const porSlide = 2;

const ShowNewConsultorio = ({ onClose, consultorioId }) => {
    const [consultorio, setConsultorio] = useState(null);
    const [imagem, setImagem] = useState(null);
    const [veterinarios, setVeterinarios] = useState([]);
    const [showLista, setShowLista] = useState(false);
    const [showCarrosel, setShowCarossel] = useState(true);
    const [showMoreVet, setShowMoreVet] = useState(null);
    const [expandDescricao, setExpandDescricao] = useState(false);
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

                if (!vets.data.content || vets.data.content.length === 0) {
                    setShowCarossel(false);
                    setVeterinarios([]);
                } else {
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
                }

                const img = await axios.get(
                    `${apiUrl}/api/consultorio/${consultorioId}/imagem`,
                    { responseType: "blob" }
                );
                setImagem(URL.createObjectURL(img.data));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [consultorioId, apiUrl]);

    if (loading) return <LoadingSpin />;

    const slides = [];
    for (let i = 0; i < veterinarios.length; i += porSlide) {
        slides.push(veterinarios.slice(i, i + porSlide));
    }

    return (
    <div className="animal-container">
        <div className="consultorioCard">

            <div className="consultorioImageContainer">
                <img
                    src={imagem || notLogin}
                    className="imagemConsultorio"
                    alt="Consultório"
                    onError={(e) => (e.target.src = notLogin)}
                />
            </div>


                <div className="consultorioInfo">
                    <p>
                        <strong>Nome</strong>
                        <span>{consultorio.nome}</span>
                    </p>

                    <p>
                        <strong>Telefone</strong>
                        <span>{consultorio.telefone}</span>
                    </p>

                    <p>
                        <strong>Endereço</strong>
                        <span>{consultorio.endereco}</span>
                    </p>

                    <p>
                        <strong>Estado</strong>
                        <span>{consultorio?.estado?.nome || "Estado não encontrada"}</span>
                    </p>

                    <p>
                        <strong>Cidade</strong>
                        <span>{consultorio.cidade?.nome || "Cidade não encontrada"}</span>
                    </p>

                    <p>
                        <strong>Data de Fundação</strong>
                        <span>{consultorio.dataDeFundacao}</span>
                    </p>
                </div>

                {consultorio.descricao && (
                    <div className="descricao-container">
                        <strong>Descrição</strong>
                        <div className={`descricao-text ${expandDescricao ? "expandida" : ""}`}>
                            {consultorio.descricao}
                        </div>
                        {consultorio.descricao?.length > 200 && (
                            <button
                                className="ver-mais-btn"
                                onClick={() => setExpandDescricao(!expandDescricao)}
                            >
                                {expandDescricao ? "Ver menos" : "Ver mais"}
                            </button>
                        )}
                    </div>
                )}

                {showCarrosel && (
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

                        {!showLista && slides.length > 0 && (
                            <div id="carouselVets" className="carousel slide">
                                <div className="carousel-inner">
                                    {slides.map((slide, i) => (
                                        <div
                                            key={i}
                                            className={`carousel-item ${i === 0 ? "active" : ""}`}
                                        >
                                            <div className="row g-4 px-3">
                                                {slide.map((vet) => (
                                                    <div key={vet.id} className="col-md-6">
                                                        <div className="card vet-card h-100 shadow-sm">
                                                            <img
                                                                src={vet.url || notLogin}
                                                                className="card-img-top"
                                                                alt={vet.nome}
                                                            />
                                                            <div className="card-body text-center">
                                                                <h5 className="text-success">{vet.nome}</h5>
                                                                <p>{vet.crvm}</p>
                                                                <button
                                                                    className="btn btn-primary w-100"
                                                                    onClick={() => setShowMoreVet(vet.id)}
                                                                >
                                                                    Ver Mais
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showLista && (
                            <div className="listaVetsContainer">
                                {veterinarios.map((vet) => (
                                    <div key={vet.id} className="vetListItem">
                                        <div>
                                            <p className="fw-bold text-success">{vet.nome}</p>
                                            <p>{vet.crvm}</p>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowMoreVet(vet.id)}
                                        >
                                            Ver Mais
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
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
