import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

const PublicRoute = ({ component: Component, restricted, ...rest }) => {
  const { loggedInuser } = useAuth();
  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route like login and register
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
