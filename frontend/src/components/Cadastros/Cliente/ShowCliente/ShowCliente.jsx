import "./ShowCliente.css"
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpin from "../../../Extras/LoadingSpin/LoadingSpin.jsx";
import { useNavigate } from "react-router-dom";


const ShowCliente = ({ 
    onClose,
    clienteId,
}) => {

    const [newCliente, setNewCliente] = useState(null)
    const [Error, setError] = useState(null);
    const [Success, setSuccess] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    
     function maskCpf(value) {
        return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    function maskPhone(value) {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .slice(0, 15);
  }




    useEffect(() => {
        const asyncFunction = async () => { 
        if (!clienteId) console.log("Erro na inicialização");
        
        try{ 
            const response = await axios.get(`${apiUrl}/api/cliente/${clienteId}`)
            console.log(response.data)
            setSuccess("A API obteve sucesso")
            setNewCliente(response.data)
        }catch(err){
            console.log(err)
            setError("Erro no get do animal")
        }
        setIsLoading(false)
    }

    asyncFunction()
    }, [clienteId])

    return (
      <div className="animal-container">
        <h2 className="title">{newCliente?.nome || "Nome não encontrado"}</h2>
        <div className="presentAnimalContainer">
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