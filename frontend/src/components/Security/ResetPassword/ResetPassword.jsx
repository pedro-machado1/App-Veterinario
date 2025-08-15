
import React from 'react';
import axios from "axios";
import LoadingSpin from '../../Extras/LoadingSpin/LoadingSpin.jsx';
import InputField from '../../Extras/InputField/InputField.jsx';
import { Link } from 'react-router-dom';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect} from 'react';

const ResetPassword = () => {

    const apiUrl = import.meta.env.VITE_API_URL;
    
    const navigate = useNavigate()
    const [params] = useSearchParams() 

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

    const CheckPassword = (password, confirmPassword) =>{ 
        if (password === confirmPassword) return true;
        else {
            HandleReset()
            setError("As Duas senhas tem que ser iguais")
            return false
        }

    }

    const HandleReset = (e) => {
        let form = document.getElementById("formsResetPassword");
        let elements = form.getElementsByClassName("isInvalid");
    

        while (elements.length > 0) {
        elements[0].classList.remove("isInvalid");
        }

        setPassword("")
        setConfirmPassword("")
        setIsLoading(false)
        setError(null)
        setSucess(null)
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();

        if (!CheckPassword(newPassword, newConfirmPassword)){
            return;
        }
        const loginData = { 
            password: newPassword
        }
        if (!document.getElementById("formsResetPassword").reportValidity()) {
            setError("Preencha todos os campos!");
            return;
        }
        setIsLoading(true)
        var token = params.get('token')
        try { 
            const response = await axios.post(
                `${apiUrl}/api/auth/reset-password?token=${token}`, 
                loginData,  
            );
            console.log("Dados", response.data);
            HandleReset();
            setSucess("Senha foi resetada com Sucesso")
            setIsLoading(false)
            setTimeout(() => {
            }, 4000)
            navigate('/login') 

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
            <h1>Trocar a sua senha</h1>
            <form
            id='formsResetPassword' 
            onSubmit={HandleSubmit} 
            >
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
                    Confirmar
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

export default ResetPassword;
