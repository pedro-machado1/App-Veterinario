import { Navigate } from "react-router-dom";
import { useAuth } from './AuthContext';
import { useLocation } from 'react-router-dom';
import LoadingSpin from "../../Extras/LoadingSpin/LoadingSpin";

function ProtectedRoute({children}) {

     const { isAuthenticated} = useAuth();
        if(isAuthenticated == false) {
            return <Navigate to={'/login'}/>
        }
        return children 
    }

export default ProtectedRoute