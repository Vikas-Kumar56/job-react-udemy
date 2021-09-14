import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jwt-decode';
import { baseUrl } from '../../config';

axios.interceptors.request.use(
  (config) => {
    const jwtToken = localStorage.getItem(window.location.origin);

    if (jwtToken !== null) {
      config.headers.Authorization = jwtToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/login`, {
        email,
        password,
      });

      const jwtToken = response.data.token;

      localStorage.setItem(window.location.origin, jwtToken);

      const decodedJwt = jwt(jwtToken);

      setUser(decodedJwt);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear(window.location.origin);
    setUser(null);
  };

  useEffect(() => {
    const jwtToken = localStorage.getItem(window.location.origin);

    if (jwtToken !== null && user === null) {
      const decoded = jwt(jwtToken);

      setUser(decoded);
    }

    setLoading(false);
  }, [user]);

  const contextValue = useMemo(() => {
    return {
      loggedInuser: user,
      login,
      logout,
    };
  }, [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      <>
        {loading && <div>Application loading...</div>}
        {loading === false && <> {children} </>}
      </>
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => React.useContext(AuthContext);
