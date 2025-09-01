import "./RegisterVeterinario.css"
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import InputField from '../../../Extras/InputField/InputField';
import LoadingSpin from '../../../Extras/LoadingSpin/LoadingSpin';

const RegisterVeterinario = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    
    const navigate = useNavigate();
    const [params] = useSearchParams() 

    const [newEmail, setEmail] = useState('');
    const [newPassword, setPassword] = useState('');
    const [newConfirmPassword, setConfirmPassword] = useState('')
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

    const CheckPassword = (password, confirmPassword) =>{ 
        if (password === confirmPassword) return true;
        else {
            HandleReset()
            setError("As Duas senhas tem que ser iguais")
            return false
        }

    }

    const HandleReset = (e) => {
        let form = document.getElementById("formsRegister");
        let elements = form.getElementsByClassName("isInvalid");
    

        while (elements.length > 0) {
        elements[0].classList.remove("isInvalid");
        }

        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setIsLoading(false)
        setError(null)
        setSucess(null)
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();

        var token = params.get('token')

        if (!CheckEmail(newEmail) || !CheckPassword(newPassword, newConfirmPassword)){
            return;
        }
        const loginData = { 
            email: newEmail,
            password: newPassword
        }
        if (!document.getElementById("formsRegister").reportValidity()) {
            setError("Preencha todos os campos!");
            return;
        }
        setIsLoading(true)
        try { 
            const response = await axios.post(
                `${apiUrl}/api/auth/registerVeterinario?token=${token}`,
                loginData
            );
            console.log("Dados", response.data);
            HandleReset();
            setSucess("Registro realizado com Sucesso")
            setIsLoading(false)
            setTimeout(() => {
            }, 4000)
            navigate(`/newVeterinario?token=${token}`,
                  
            ) 

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
                <InputField 
                 label="Senha"
                 type="password"
                 value={newPassword}
                 onChange={(e) => { 
                    setPassword(e.target.value)
                    isValid(e)
                 }}
                 onInvalid={(e) => isInvalid(e)}
                 required />
                 <InputField
                 label= "Confirmar senha"
                 type = "password"
                 value = {newConfirmPassword}
                 onChange={(e) => { 
                    setConfirmPassword(e.target.value)
                    isValid(e)
                 }}
                 onInvalid= {(e) => isInvalid(e)}
                 required
                 />
                <button 
                type="submit"
                >
                    Cadastrar
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

export default RegisterVeterinario;
