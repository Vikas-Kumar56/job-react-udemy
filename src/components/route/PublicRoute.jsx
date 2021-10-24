import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { loggedInuser } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) =>
        loggedInuser && restricted ? (
          <Redirect to='/' />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
