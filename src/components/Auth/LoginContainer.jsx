import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Typography,
  TextField,
  Button,
  Paper,
  Box,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import * as yup from 'yup';
import { styled } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const StyledPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Heading = styled(Typography)({
  padding: '10px',
  fontSize: '2em',
  fontWeight: 'bold',
});

const Email = styled(TextField)({
  margin: '20px 0px',
  width: '30%',
});

const Password = styled(TextField)({
  marginBottom: '20px',
  width: '30%',
});

const LoginButton = styled(Button)({
  marginBottom: '20px',
  width: '30%',
});

const validationSchema = yup.object({
  email: yup
    .string('Enter email address')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter password')
    .required('Password is required')
    .min(8, 'Password should be of minimum 8 char length'),
});

const LoginContainer = () => {
  const [loginError, setLoginError] = useState(false);
  const { login } = useAuth();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      login(values.email, values.password)
        .then(() => {
          history.push('/');
        })
        .catch(() => {
          setLoginError(true);
        });
    },
  });

  const snackbarErrorView = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={loginError}
        autoHideDuration={6000}
        onClose={() => setLoginError(false)}
      >
        <Alert onClose={() => setLoginError(false)} severity='error'>
          Please verify your credentials!
        </Alert>
      </Snackbar>
    );
  };

  return (
    <>
      <form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
        <Box>
          <StyledPaper>
            <Heading variant='h4'>Job Posting Login</Heading>
            <Email
              name='email'
              id='email'
              label='Enter email address'
              variant='outlined'
              placeholder='Enter email address'
              value={formik.values.email}
              onChange={formik.handleChange}
              helperText={formik.touched.email && formik.errors.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
            />
            <Password
              name='password'
              id='password'
              type='password'
              label='Enter password'
              variant='outlined'
              placeholder='Enter password'
              value={formik.values.password}
              onChange={formik.handleChange}
              helperText={formik.touched.password && formik.errors.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            <LoginButton
              data-testid='login'
              type='submit'
              variant='contained'
              color='primary'
            >
              Login
            </LoginButton>
          </StyledPaper>
        </Box>
      </form>
      {snackbarErrorView()}
    </>
  );
};

export default LoginContainer;
