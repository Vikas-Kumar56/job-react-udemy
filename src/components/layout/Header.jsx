import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';

const Header = () => {
  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant='h6'>Job Posting Application</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
