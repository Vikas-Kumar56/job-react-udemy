import React, { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import jwt from 'jwt-decode';
import { useHistory } from 'react-router-dom';
import { baseUrl } from '../../config';

const AuthContext = React.createContext();

// axios interceptor for fetching token from local storage
// append on every http request
axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('job-udemy-app');
    if (token != null) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthProvider = ({ children }) => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [state, setState] = useState('loading');

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${baseUrl}/api/v1/users/login`, {
        email,
        password,
      });

      const jwtToken = response.data.token;
      // store jwt token in local storage
      localStorage.setItem('job-udemy-app', jwtToken);

      // extract jwt token and set user in context
      const decodedJwt = jwt(jwtToken);
      setUser(decodedJwt);
    } catch (error) {
      throw error;
    }
  };

  //when application load check for token is available in local storage
  useEffect(() => {
    const jwtToken = localStorage.getItem('job-udemy-app');
    if (jwtToken != null && user == null) {
      const decodedToken = jwt(jwtToken);

      setUser(decodedToken);
    }

    setState('loaded');
  }, [history, user]);

  const contextValue = useMemo(() => {
    return {
      loggedInuser: user,
      login,
    };
  }, [user]);

  return (
    <AuthContext.Provider value={contextValue}>
      <>
        {state === 'loaded' && <>{children}</>}
        {state === 'loading' && <div>Loading Application</div>}
      </>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export const useAuth = () => React.useContext(AuthContext);
