import { useState } from "react";
import "./ForgotPassword.css";


const ForgotPassword = () => {

}
return (
    <div>
        <h1>Redefinir Senha</h1>
        <form>
            <InputField label="Email" type="email" required />
            <InputField label="Nova Senha" type="password" required />
            <InputField label="Confirmar Nova Senha" type="password" required />
            <button type="submit">Redefinir Senha</button>
        </form>
    </div>
);

export default NewConsultorio;