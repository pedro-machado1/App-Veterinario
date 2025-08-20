import React from 'react';
import axios from "axios";
import LoadingSpin from '../../Extras/LoadingSpin/LoadingSpin.jsx';
import InputField from '../../Extras/InputField/InputField.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const LoginComponents = () => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const navigate = useNavigate()

    const [newemail, setEmail] = useState('');
    const [newpassword, setPassword] = useState('');
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
        let form = document.getElementById("formsLogin");
        let elements = form.getElementsByClassName("isInvalid");
    

        while (elements.length > 0) {
        elements[0].classList.remove("isInvalid");
        }

        setEmail("")
        setPassword("")
        setIsLoading(false)
        setError(null)
        setSucess(null)
    }

    const HandleSubmit = async (e) => {
        e.preventDefault();

        if (!CheckEmail(newemail)){
            return;
        }
        const loginData = { 
            email: newemail,
            password: newpassword
        }
        if (!document.getElementById("formsLogin").reportValidity()) {
            setError("Preencha todos os campos!");
            return;
        }
        setIsLoading(true)
        try { 
            const response = await axios.post(
                `${apiUrl}/api/auth/login`, 
                loginData,
            );
            console.log("Dados", response.data);
            localStorage.setItem('authToken', response.data);
            HandleReset();
            setSucess("Login realizado com Sucesso")
            setIsLoading(false)
            navigate('/mainPage')
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
            <h1>Login</h1>
            <form
            id='formsLogin' 
            onSubmit={HandleSubmit} 
            >
                <InputField 
                label="Email"
                 type="email"
                 value = {newemail}
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
                 value={newpassword}
                 onChange={(e) => { 
                    setPassword(e.target.value)
                    isValid(e)
                 }}
                 onInvalid={(e) => isInvalid(e)}
                 required />
                <button 
                type="submit"
                >
                    Entrar
                </button>
                <div className="errorsOrSuccess">
                    <p style={{ color: "red" }}>{Error && Error}</p>
                    <p style={{ color: "green" }}>{Sucess && Sucess}</p>
                </div>
                <p>
                    Esqueceu a senha? <Link to="/reset-password">Clique aqui</Link>
                </p>
                <p>
                    Não tem uma conta? <Link to="/register">Registre-se</Link>
                </p>
            </form>
            {isLoading && <LoadingSpin/>}
        </div>
    );
};

export default LoginComponents;
