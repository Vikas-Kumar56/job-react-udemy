import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import Layout from './components/layout';
import JobContainer from './components/job/JobContainer';
import LoginContainer from './components/Auth/LoginContainer';
import AuthProvider from './components/Auth/AuthProvider';
import RegisterContainer from './components/Auth/RegisterContainer';
import PublicRoute from './components/route/PublicRoute';
import PrivateRoute from './components/route/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Switch>
            <PrivateRoute exact path='/' component={JobContainer} />
            <PublicRoute
              restricted
              exact
              path='/login'
              component={LoginContainer}
            />
            <PublicRoute
              restricted
              exact
              path='/register'
              component={RegisterContainer}
            />
          </Switch>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
