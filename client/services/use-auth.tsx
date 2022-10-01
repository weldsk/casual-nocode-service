import axios, { AxiosResponse, AxiosError } from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import authHeader from "./auth-header";

type AuthContextType = {
  isAuthenticated: boolean;
  processLogout: () => void;
};

const authContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(authContext) as AuthContextType;
};

const AuthProvider: React.FC<React.ReactNode> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const processLogout = () => {
    /*TODO*/
    localStorage.removeItem("user");
  };

  const value = {
    isAuthenticated,
    processLogout,
  };

  useEffect(() => {
    updateLoginStatus();
  });

  const updateLoginStatus = async () => {
    await axios
      .get(process.env.REACT_APP_PRIVATE_API_URL + "/status", {
        headers: authHeader(),
      })
      .then((response: AxiosResponse) => {
        setIsAuthenticated(true);
      })
      .catch((error: AxiosError) => {
        setIsAuthenticated(false);
      });
    setLoading(false);
  };

  return (
    <authContext.Provider value={value}>
      {!loading && children}
    </authContext.Provider>
  );
};

export default AuthProvider;
