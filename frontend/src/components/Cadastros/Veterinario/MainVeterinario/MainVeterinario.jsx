
  import "./MainVeterinario.css";
  import axios from "axios";
  import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin";
  import { useEffect, useState } from "react";
  import { useSearchParams } from "react-router-dom";
  import ShowVeterinario from "../ShowVeterinario/ShowVeterinario";
  import notLogin from "../../../../assets/images/notLogin.png"
  import InputField from "../../../Extras/InputField/InputField";

  const MainVeterinario = () => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const [params] = useSearchParams()

    const [veterinarios, setVeterinarios] = useState([]);
    const [searchCrvm, setSearchCrvm] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [showMore, setShowMore] = useState(null);
    const [error, setError] = useState(null);

    const showMoreToggle = (veterinarioId) => {
      if (showMore === veterinarioId) {
        setShowMore(null);
      } else {
        setShowMore(veterinarioId);
      }
    };

    const fetchVeterinarios = async () => {
      let response; 
      setIsLoading(true)
      var consultorioId = params.get("consultorioId")
      setError(null);
      try {
        
        if (!consultorioId) { 
          if (searchCrvm !== "") {
            response = await axios.get(`${apiUrl}/api/veterinario?crvm=${searchCrvm}`)
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
        else {
          console.log(response.data.content)
          const veterinario = response.data.content
          const veterinarioComImagens = await Promise.all(veterinario.map(async (veterinario) => {
            try {
              const imageResponse = await axios.get(`${apiUrl}/api/veterinario/${veterinario.id}/imagem`,
                { responseType: 'blob' }
              );
              const image = URL.createObjectURL(imageResponse.data)
              console.log(veterinario + " " + imageResponse.data)
              return { ...veterinario, url: image };
            } catch (error) {
              return { ...veterinario, url: null };
            }
          }))
          setVeterinarios(veterinarioComImagens)
          console.log(veterinario)

        }
      } catch (err) {
        setError("Erro ao carregar os veterinários");
      }
      setIsLoading(false);
    };

    useEffect(() => {
      fetchVeterinarios();
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
          <button onClick={() => fetchVeterinarios()}>Pesquisar</button>
          </div>

        <div className="displayDeVeterinarios">
          {veterinarios.map((vet) => (
            <div key={vet.id} className="Veterinario">
              {vet.imagem ? (
                <img src={vet.url} alt={`Foto de ${vet.nome}`} className="veterinario-image" />
              ) : (
                <img src={notLogin} className="veterinario-image" />
              )}

              <p>
                <strong>Nome:</strong> {vet.nome || "Erro: nome não encontrado"}
              </p>
              <p>
                <strong>CPF:</strong> {vet.cpf || "Erro: CPF não encontrado"}
              </p>
              <p>
                <strong>CRVM:</strong> {vet.crvm || "Erro: CRVM não encontrado"}
              </p>
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

        {isLoading && <LoadingSpin />}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    );
  };

  export default MainVeterinario;