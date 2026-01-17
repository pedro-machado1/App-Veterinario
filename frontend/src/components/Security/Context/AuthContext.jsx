
import { createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios'


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [newUser, setNewUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/auth/authentication`,
          {withCredentials : true}
        )
        setNewUser(response.data)
        setIsAuthenticated(true)
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
      const authResponse = await axios.get(`
        ${apiUrl}/api/auth/authentication`
      );
      setNewUser(authResponse.data);
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
      setNewUser(null);
      setIsAuthenticated(false);
    }catch(err){
      throw err;
    }
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
