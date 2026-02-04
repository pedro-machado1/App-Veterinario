import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingSpin from '../../components/Extras/LoadingSpin/LoadingSpin';
import "./VerifyEmailPage.css";

const VerifyEmailPage = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isVerified, setIsVerified] = useState(false);
    const [userType, setUserType] = useState('cliente'); 

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            const type = searchParams.get('type') || 'cliente';
            setUserType(type);

            if (!token) {
                setError('Token de verificação não encontrado');
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.post(
                    `${apiUrl}/api/auth/verify-email?token=${token}`
                );
                setMessage(response.data);
                setIsVerified(true);
                
                setTimeout(() => {
                    navigate('/newCliente');
                }, 3000);
            } catch (err) {
                setError(err.response?.data || 'O token pode ter expirado.');
            } finally {
                setIsLoading(false);
            }
        };

        verifyEmail();
    }, [searchParams, navigate, apiUrl]);

    return (
        <div className="verifyEmailContainer">
            <div className="verifyEmailCard">
                <h1>Verificação de Email</h1>

                {isLoading && (
                    <>
                        <LoadingSpin />
                        <p>Verificando seu email...</p>
                    </>
                )}

                {isVerified && !isLoading && (
                    <div className="successMessage">
                        <div className="checkmark">✓</div>
                        <p className="successText">{message}</p>
                        <p className="redirectText">Cadastro feito com sucesso</p>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="errorMessage">
                        <div className="errorIcon">✕</div>
                        <p className="errorText">{error}</p>
                        <button 
                            className="retryButton"
                            onClick={() => navigate(userType === 'consultorio' ? '/registerConsultorio' : '/register')}
                        >
                            Voltar ao Registro
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;

