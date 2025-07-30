import "./NewCliente.css";
import { useState } from 'react';
import InputField from "../InputField/InputField"; 
import axios from "axios";


// formatar value do cpf e telefone
const NewCliente = () => { 

    const [newName, setName] = useState("");
    const [newCpf, setCpf] = useState("");
    const [newEmail, setEmail] = useState("");
    const [newPhone, setPhone] = useState("");
    const [newdataDeNascimento, setdataDeNascimento] = useState("");
    const [newEndereco, setEndereco] = useState("");
    const [newImagem, setImagem] = useState("");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] =  useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
    };

  const isValid = (e) => {
    if (e.target.value && e.target.className.indexOf("isInvalid") != -1) {
      console.log(e.target.className)
      e.target.classList.remove("isInvalid");
    }
  };

  const CheckEmail = (email)=> {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (emailRegex.test(email)) {
      setError(null);
    } else {
      setError('Formato de Email Inválido!');
      return
    }
  }

  const CheckPhone = (phone)=> {
    const phoneRegex = /^(\(?\d{2}\)?[\s-]?(\d{4,5})[\s-]?(\d{4})|\d{4,5}-\d{4})$/;
    if (phoneRegex.test(phone)) {
      setError(null);
    } else {
      setError('Formato de Telefone Inválido!');
    }
  }

  const CheckCpf = (cpf)=> {
    const cpfRegex = /^(?!.*(\d)(?:-?\1){10})\d{3}\.\d{3}\.\d{3}-\d{2}$|^(\d{11})$/;
    if (cpfRegex.test(cpf)) {
        setError(null);
    } else {
        setError('Formato de Cpf Inválido!');
        return;
    }
 }

  const CheckDate = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    if (inputDate > today) {
      setError('Data de Nascimento não pode ser futura!');
      return;
    } else {
      setError(null);
    }
  }

    const handleReset = () => {
        let form = document.getElementById("formsNewClient");
        let elements = form.getElementsByClassName("isInvalid");
    
        while (elements.length > 0) {
        elements[0].classList.remove("isInvalid");
        }

        setName("");
        setCpf("");
        setEmail("");
        setPhone("");
        setdataDeNascimento("");
        setEndereco("");
        setImagem("");
        setError(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(newName, newCpf, newEmail, newPhone, newdataDeNascimento, newEndereco);
        const newClient = {
            nome: newName,
            cpf: newCpf.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"),
            email: newEmail,
            telefone: newPhone.replace(/\D/g, "").replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3"),
            dataDeNascimento: newdataDeNascimento,
            endereco: newEndereco
            // imagem: newImagem,
        };
        try {
            const response = await axios.post(
                `${apiUrl}/api/cliente`, 
                newClient
            );
            console.log('New Client:', response.data);
        } catch (error) {
            console.error('Error creating client:', error);
        }

        handleReset();
    };
    return (
        <div className="cliente-container ">
            <h1 className="title">
                Registre um cliente
            </h1>
            <form  
                  id="formsNewClient"
                  onReset={handleReset}
                  onSubmit={handleSubmit}>

                <div className="line1">
                    <InputField
                        label="Nome"
                        placeholder={"Digite o nome do cliente"}
                        name={"name"}
                        idInput="newName"
                        classNameDiv="inputName"
                        value={newName}
                        onChange={(e) => {
                            setName(e.target.value);
                            isValid(e);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                    <InputField
                        label="CPF"
                        placeholder={"Digite o CPF do cliente"}
                        name={"cpf"}
                        idInput="newCpf"
                        classNameDiv="inputCpf"
                        value={newCpf}
                        onChange={(e) => {
                            setCpf(e.target.value);
                            isValid(e);
                            CheckCpf(newCpf);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                </div>
                <div className="line2">
                    <InputField
                        label="E-mail"
                        placeholder={"Digite o e-mail do cliente"}
                        name={"email"}
                        idInput="newEmail"
                        classNameDiv="inputEmail"
                        value={newEmail}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            CheckEmail(newEmail);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                    <InputField
                        label="Telefone"
                        placeholder={"Digite o telefone do cliente"}
                        name={"phone"}
                        idInput="newPhone"
                        classNameDiv="inputPhone"
                        value={newPhone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            isValid(e);
                            CheckPhone(newPhone);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                    <InputField
                        label="Data de Nascimento"
                        placeholder={"Digite a data de nascimento do cliente"}
                        name={"dataDeNascimento"}
                        idInput="newdataDeNascimento"
                        classNameDiv="inputdataDeNascimento"
                        type="date"
                        value={newdataDeNascimento}
                        onChange={(e) => {
                            setdataDeNascimento(e.target.value);
                            isValid(e);
                            CheckDate(newdataDeNascimento);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                </div>
                <div className="line3"></div>
                    <InputField
                        label="Endereço"
                        placeholder={"Digite o endereço do cliente"}
                        idInput="newendereco"
                        classNameDiv="inputendereco"
                        value={newEndereco}
                        onChange={(e) => {
                            setEndereco(e.target.value);
                            isValid(e);
                        }}
                        onInvalid={(e) => isInvalid(e)}
                        required
                    />
                    <InputField
                        label="URL da Imagem"
                        placeholder={"Digite a URL da imagem do cliente"}
                        idInput="newImagem"
                        classNameDiv="inputImagem"
                        value={newImagem}
                        onChange={(e) => setImagem(e.target.value)}
                    />
                <div className="error-message">
                    {error && <p className="error">{error}</p>}
                </div>
                    <button 
                    type="submit" 
                    onClick={handleSubmit}
                    className="submit">
                    Enviar
                    </button>
                <button
                    type="reset"
                    className="cancelar"
                    onClick={() => handleReset()}
                >
                    Cancelar
                </button>
            </form>
        </div>
    );
};

export default NewCliente;