import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  styled,
  Button,
  Icon,
} from '@material-ui/core';
import { AccountCircleOutlined } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const ActionBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '5px',
});

const IconWrapper = styled(Typography)({
  display: 'flex',
});

const LoggedInUser = styled(Icon)({
  marginRight: '10px',
});

const Header = () => {
  const { loggedInuser, logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };
  return (
    <AppBar position='static'>
      <StyledToolbar>
        <Typography variant='h6'>Job Posting Application</Typography>
        <ActionBox>
          {loggedInuser && (
            <IconWrapper variant='h6'>
              <LoggedInUser>
                <AccountCircleOutlined />
              </LoggedInUser>
              <span>{loggedInuser.username}</span>
            </IconWrapper>
          )}
          <Box>
            {!loggedInuser && (
              <>
                <Button
                  onClick={() => history.push('/register')}
                  variant='text'
                  color='inherit'
                >
                  Register
                </Button>
                <Button
                  onClick={() => history.push('/login')}
                  variant='text'
                  color='inherit'
                >
                  Login
                </Button>
              </>
            )}
            {loggedInuser && (
              <Button onClick={handleLogout} variant='text' color='inherit'>
                Logout
              </Button>
            )}
          </Box>
        </ActionBox>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;
