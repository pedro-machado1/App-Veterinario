import { Navigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';

function ProtectedRoute({children}) {

    const location = useLocation();
    const { isAuthenticated } = useAuth();
    
    if(!isAuthenticated) {
        return <Navigate to={'/login'}/>
    }
    return children 
}

export default ProtectedRoute