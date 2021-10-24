import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loggedInuser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedInuser ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
};

export default PrivateRoute;
