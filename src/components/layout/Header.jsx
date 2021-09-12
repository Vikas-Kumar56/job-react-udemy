import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { useAuth } from '../Auth/AuthProvider';

const Header = () => {
  const { loggedInuser } = useAuth();
  console.log(loggedInuser);
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6'>Job Posting Application</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
