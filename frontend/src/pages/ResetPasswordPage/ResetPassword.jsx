import "./ResetPassword.css";
import InputField from "../../Extras/InputField/InputField";
import axios from "axios";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL;
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }
        try {
            const response = await axios.post(`${apiUrl}/api/reset-password`, {
                email,
                newPassword
            });
            alert("Senha redefinida com sucesso!");
        } catch (error) {
            alert("Erro ao redefinir senha.");
        }
    }

    return (
        <div className="reset-password-container">
            <h1>Redefinir Senha</h1>
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <InputField
                    label="Nova Senha"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <InputField
                    label="Confirmar Nova Senha"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Redefinir Senha</button>
            </form>
        </div>
    );
}

export default ResetPassword;
