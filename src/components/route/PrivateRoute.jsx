import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loggedInuser } = useAuth();
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to /login page
    <Route
      {...rest}
      render={(props) =>
        loggedInuser ? <Component {...props} /> : <Redirect to='/login' />
      }
    />
  );
};

export default PrivateRoute;
