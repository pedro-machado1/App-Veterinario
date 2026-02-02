import "./LoginComponents.css"
import LoadingSpin from '../../Extras/LoadingSpin/LoadingSpin.jsx';
import InputField from '../../Extras/InputField/InputField.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../Context/AuthContext.jsx'; 

const LoginComponents = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [newemail, setEmail] = useState('');
    const [newpassword, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [Error, setError] = useState(null);
    const [Sucess, setSucess] = useState(null);

    const isInvalid = (e) => {
    e.target.classList.add("isInvalid");
    };

    const isValid = (e) => {
        if (e.target.value && e.target.className.indexOf("isInvalid") !== -1) {
            e.target.classList.remove("isInvalid");
        }
    };

    const CheckEmail = (email) => {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if (emailRegex.test(email)) {
            setError(null);
            return true;
        } else {
            HandleReset();
            setError('Formato de Email Inválido!');
            return false;
        }
    };

    const HandleReset = () => {
        let form = document.getElementById("formsLogin");
        if (form) {
            let elements = form.getElementsByClassName("isInvalid");
            while (elements.length > 0) {
                elements[0].classList.remove("isInvalid");
            }
        }
        setEmail("");
        setPassword("");
        setIsLoading(false);
        setError(null);
        setSucess(null);
    };

    const HandleSubmit = async (e) => {
        e.preventDefault();

        if (!CheckEmail(newemail)) return;

        const loginData = { 
            email: newemail,
            password: newpassword
        };

        if (!e.target.reportValidity()) {
            setError("Preencha todos os campos!");
            return;
        }

        setIsLoading(true);
        try { 
            const response = await login(loginData);
            setSucess("Login realizado com Sucesso");
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            HandleReset();

            if (response.data === "CLIENTE") navigate("/animal");
            else if (response.data === "CONSULTORIO") navigate("/userProfile");
            else if (response.data === "VETERINARIO") navigate("/cliente");
            
        } catch (err) {
            HandleReset();
            console.error(err);
            if (err.response && err.response.data) {
                setError("Email ou senha inválidos");
            } else {
                setError("Erro ao conectar com o servidor");
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className='loginContainer'>
            <div className='loginForms'>
                <h1>Login</h1>
                <form id='formsLogin' onSubmit={HandleSubmit}>
                    
                    <div className="input-full-width">
                        <InputField 
                            label="Email"
                            type="email"
                            classNameDiv="emailLogin"
                            value={newemail}
                            onChange={(e) => { 
                                setEmail(e.target.value);
                                isValid(e);
                            }}
                            onInvalid={(e) => isInvalid(e)}
                            required 
                        />
                    </div>

                    <div className="input-full-width">
                        <InputField 
                            label="Senha"
                            type="password"
                            classNameDiv="senhaLogin"
                            value={newpassword}
                            onChange={(e) => { 
                                setPassword(e.target.value);
                                isValid(e);
                            }}
                            onInvalid={(e) => isInvalid(e)}
                            required 
                        />
                    </div>

                    <button id="submitbotao" type="submit">
                        Entrar
                    </button>

                    <div className="errorsOrSuccess">
                        {Error && <p style={{ color: "red" }}>{Error}</p>}
                        {Sucess && <p style={{ color: "green" }}>{Sucess}</p>}
                    </div>
                    
                    <p>
                        Esqueceu a senha? <Link to="/forgot-password">Clique aqui</Link>
                    </p>
                    <p>
                        Não tem uma conta? <Link to="/register">Registre-se</Link>
                    </p>
                </form>
            </div>
            {isLoading && <LoadingSpin/>}
        </div>
    );
};

export default LoginComponents