
import { createContext, useState, useContext, useEffect} from 'react';
import axios from 'axios'


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [newUser, setNewUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await axios.post(`${apiUrl}/api/auth/authentication`,
          {},
          {withCredentials : true}
        )
        setIsAuthenticated(true)
        setNewUser(response.data)
      } catch (err) {
        setIsAuthenticated(false);
        setNewUser(null);
      } finally {
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
      setIsAuthenticated(true);
      setNewUser(response.data.user);
      return response.data.user;
    } catch (error) {
      setIsAuthenticated(false);
      setNewUser(null);
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, newUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
