import React from 'react';
import InputField from '../../components/Extras/InputField/InputField.jsx';
import { Link } from 'react-router-dom';

const LoginComponents = () => {
    return (
        <div>
            <h1>Login</h1>
            <form>
                <InputField label="Email" type="email" required />
                <InputField label="Senha" type="password" required />
                <button type="submit">Entrar</button>
            </form>
            <p>
                Esqueceu a senha? <Link to="/resetpassword">Clique aqui</Link>
            </p>
            <p>
                Não tem uma conta? <Link to="/newCliente">Registre-se</Link>
            </p>
        </div>
    );
};

export default LoginComponents;
