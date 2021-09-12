import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Layout from './components/layout';
import JobContainer from './components/job/JobContainer';
import LoginContainer from './components/Auth/LoginContainer';
import AuthProvider from './components/Auth/AuthProvider';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Switch>
            <Route exact path='/' component={JobContainer} />
            <Route exact path='/login' component={LoginContainer} />
          </Switch>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
