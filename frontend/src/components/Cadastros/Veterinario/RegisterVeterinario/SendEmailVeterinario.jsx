import "./RegisterVeterinario.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../../../Extras/InputField/InputField';
import LoadingSpin from '../../../Extras/LoadingSpin/LoadingSpin';

const SendEmailVeterinario = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    

    const [newEmail, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [Error, setError] = useState(null);
    const [Sucess, setSucess] = useState(null);

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
        return true;
        } else {
        HandleReset()
        setError('Formato de Email Inválido!');
        return false;
        }
    }

    const HandleReset = (e) => {
        let form = document.getElementById("formsRegister");
        let elements = form.getElementsByClassName("isInvalid");
    
        while (elements.length > 0) {
        elements[0].classList.remove("isInvalid");
        }

        setEmail("")
        setIsLoading(false)
        setError(null)
        setSucess(null)
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();

        if (!CheckEmail(newEmail)){
            return;
        }
        const loginData = { 
            email: newEmail,
        }
        if (!document.getElementById("formsRegister").reportValidity()) {
            setError("Preencha todos os campos!");
            return;
        }
        setIsLoading(true)
        try { 
            const response = await axios.post(
                `${apiUrl}/api/veterinario/register`, 
                loginData,  
            );
            console.log("Dados", response.data);
            HandleReset();
            setSucess("Informe o veterinário para registrar o usuário")
            setIsLoading(false)
        } catch (err) {
            setIsLoading(false)
            HandleReset();
            console.error(err);
            if (err.response && err.response.data) {
                setIsLoading(false);
                setError(`${err.response.data.message}`);
            }
        }
    }
       

    return (
        <div>
            <h1>Cadastrar Novo Veterinario Para o Consultorio</h1>
            <p> Aqui você deverá colocar um email do veterinario 
                para que ele possa criar a conta e registrar as suas 
                informações
            </p>
            <form
            id='formsRegister' 
            onSubmit={HandleSubmit} 
            >
                <InputField 
                label="Email"
                 type="email"
                 value = {newEmail}
                 onChange={(e) => { 
                    setEmail(e.target.value);
                    isValid(e)
                 }}
                 onInvalid={(e) => isInvalid(e)}
                 required 
                 />
                <button 
                type="submit"
                >
                    Mandar o e-mail
                </button>
                
                <div className="errorsOrSuccess">
                    <p style={{ color: "red" }}>{Error && Error}</p>
                    <p style={{ color: "green" }}>{Sucess && Sucess}</p>
                </div>
            </form>
            {isLoading && <LoadingSpin/>}
        </div>
    );
};

export default SendEmailVeterinario;
