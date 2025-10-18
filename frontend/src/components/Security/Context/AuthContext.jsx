
import { createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios'


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [newUser, setNewUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    var syncVariable;
    const authenticateUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/authentication`,
          {withCredentials : true}
        )
        setNewUser(response.data)
        setIsAuthenticated(true)
        console.log(response.data)
      } catch (err) {
        setNewUser(null);
        setIsAuthenticated(false);
      }
    }

    authenticateUser()
  }, [])

  const login = async (loginData) => {
    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        loginData,
      );
      setNewUser(response.data.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      setNewUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/auth/logout`, 
          {withCredentials : true}
      )
      setIsAuthenticated(false);
    }catch(err){
      throw err;
    };
    
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, newUser}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
