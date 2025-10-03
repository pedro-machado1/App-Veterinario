
  import "./MainVeterinario.css";
  import axios from "axios";
  import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
  import { useEffect, useState } from "react";
  import { useSearchParams } from "react-router-dom";
  import ShowVeterinario from "../ShowVeterinario/ShowVeterinario";
  import notLogin from "../../../../assets/images/notLogin.png"
  import InputField from "../../../Extras/InputField/InputField";
import { flushSync } from "react-dom";

  const MainVeterinario = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [params] = useSearchParams()

    const [veterinarios, setVeterinarios] = useState([]);
    const [searchCrvm, setSearchCrvm] = useState("")
    const [newSwitch, setNewSwitch] = useState(false)
    const [isLoading, setIsLoading] = useState(true);
    const [showMore, setShowMore] = useState(null);
    const [showMoreSecond, setShowMoreSecond] = useState(null);

    const [error, setError] = useState(null);

    const showMoreToggle = (veterinarioId) => {
      if (showMore === veterinarioId) {
        setShowMore(null);
      } else {
        setShowMore(veterinarioId);
      }
    };

    const ToggleshowMoreSecond = (veterinarioId) => {
      if (showMore === veterinarioId) {
        setShowMoreSecond(null);
      } else {
        setShowMoreSecond(veterinarioId);
      }
    };

    function maskCpf(value) {
        return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }


    const fetchVeterinarios = async (crvm, switchValue) => {
      let response; 
      setIsLoading(true)
      var consultorioId = params.get("consultorioId")
      setError(null);
      try {
        
        if (!consultorioId) { 
          if (crvm !== "") {
            response = await axios.get(`${apiUrl}/api/veterinario?crvm=${crvm}`)
          }
          else { 
            response= await axios.get(`${apiUrl}/api/veterinario`);
          }
          console.log(response.data)

        }
        else{
          response = await axios.get(`${apiUrl}/api/consultorio/${consultorioId}/veterinario`);
          console.log(response.data)
        }
        if (response.data.content.length === 0) {
          setVeterinarios([])
          setError("Você não possui nenhum veterinário cadastrado");
        }
        else if (!switchValue) {
          console.log(response.data.content)
          const veterinario = response.data.content
          const veterinarioComImagens = await Promise.all(veterinario.map(async (veterinario) => {
            try {
              const imageResponse = await axios.get(`${apiUrl}/api/veterinario/${veterinario.id}/imagem`,
                { responseType: 'blob' }
              );
              const image = URL.createObjectURL(imageResponse.data)
              return { ...veterinario, url: image };
            } catch (error) {
              return { ...veterinario, url: null };
            }
          }))
          setVeterinarios(veterinarioComImagens)
          console.log(veterinario)
        }
        else {
          setVeterinarios(response.data.content)
        }
      } catch (err) {
        setError("Erro ao carregar os veterinários");
      }
      setIsLoading(false);
    };

    useEffect(() => {
      fetchVeterinarios(searchCrvm, newSwitch);
    }, [showMore]);

    return (
      <div className="containerVeterinario">

        <h1 id="titulo">Veterinários</h1>
        <div className="searchContainer">
          <InputField
              placeholder="Pesquisar por CRVM"
              value={searchCrvm}
              onChange={(e) => setSearchCrvm(e.target.value)}
          />
          <button onClick={() => fetchVeterinarios(searchCrvm, newSwitch)} className="botaoPesquisar">Pesquisar</button>
          <button className= "botaoLimpar" onClick={() => {  
              fetchVeterinarios("", newSwitch)
              setSearchCrvm("")
              } } >
                  LimparFiltro
          </button>
        </div>
        
        <div className="toggleContainer">
          <span className="toggleLabel">Estilo:</span>
          
          <label className="switch">
            <input 
                type="checkbox" 
                checked={newSwitch} 
                onChange={() => setNewSwitch(!newSwitch)} 
            />
            <span className="slider round"></span>
          </label>
        </div>

        { !newSwitch && (  
          <div className="displayDeVeterinarios">
            {veterinarios.map((vet) => (
              <div key={vet.id} className="Veterinario">
                <div className="veterinarioWrapper">

                  {vet.imagem ? (
                    <img src={vet.url} alt={`Foto de ${vet.nome}`} className="veterinario-image" />
                  ) : (
                    <img src={notLogin} className="veterinario-image" />
                  )}
                  <div className="informacoesVeterinario">
                  <p>
                    <strong>Nome:</strong> {vet.nome || "Erro: nome não encontrado"}
                  </p>
                  <p>
                    <strong>CPF:</strong> {maskCpf(vet.cpf) || "Erro: CPF não encontrado"}
                  </p>
                  <p>
                    <strong>CRVM:</strong> {vet.crvm || "Erro: CRVM não encontrado"}
                  </p>
                  </div>
                </div>
  
                <button className="Edit" onClick={() => showMoreToggle(vet.id)}>
                  Ver Mais
                </button>
                {showMore === vet.id && <ShowVeterinario
                  onClose={() => setShowMore(false)}
                  veterinarioId={vet.id}
                />
                }
              </div>
            ))}
          </div>
        )}
        
        { newSwitch && (
          <div className="displayDeVeterinariosSecond">
            {veterinarios.map((veterinario) => (
                <div key={veterinario.id} className="VeterinarioCard">
                    <p className="veterinarioNome">
                        <strong>Nome:</strong> {veterinario.nome || "Nome não encontrado"}
                    </p>
                    <p className="cpfNome">
                        <strong>CPF:</strong> {maskCpf(veterinario.cpf) || "CPF não encontrado"} 
                    </p> 
                    <p className="CRVM">
                        <strong>CRVM:</strong> {veterinario.crvm || "CRVM Não encontrado"} 
                    </p> 
                    <button 
                        className="showMoreButtonVeterinario"
                        onClick={() => setShowMoreSecond(veterinario.id)}
                    > 
                        Ver Mais
                    </button>
                        {showMoreSecond === veterinario.id && 
                            <div className="overlay">
                                <ShowVeterinario
                                    onClose={() => setShowMoreSecond(null)}
                                    veterinarioId={veterinario.id}
                                />
                            </div>
                        }
                </div> 
            ))}
          </div>
          
        )}
          
        {isLoading && <LoadingSpin />}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  };

  export default MainVeterinario;