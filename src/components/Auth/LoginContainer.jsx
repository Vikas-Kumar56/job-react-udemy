import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  styled,
  Snackbar,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import * as yup from 'yup';
import { useFormik } from 'formik';
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
  width: '30%',
  marginBottom: '20px',
});

const validationSchema = yup.object({
  email: yup
    .string('Enter you email')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(8, 'Password should be of minimum 8 char length')
    .required('Password is required'),
});

const LoginContainer = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [error, setError] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      login(values.email, values.password)
        .then(() => {
          history.push('/');
        })
        .catch((error) => {
          setError(true);
        });
    },
  });

  const handleClose = () => {
    setError(false);
  };

  const getErrorView = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={error}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity='error'>
          Please verify your credential!
        </Alert>
      </Snackbar>
    );
  };

  return (
    <>
      {getErrorView()}
      <form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
        <Box>
          <StyledPaper>
            <Heading variant='h4'>Job Posting Login</Heading>
            <Email
              name='email'
              id='email'
              data-testid='email-testid'
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
              data-testid='password-testid'
              label='Enter password'
              variant='outlined'
              placeholder='Enter password'
              value={formik.values.password}
              onChange={formik.handleChange}
              helperText={formik.touched.password && formik.errors.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
            />
            <LoginButton type='submit' variant='contained' color='primary'>
              Login
            </LoginButton>
          </StyledPaper>
        </Box>
      </form>
    </>
  );
};

export default LoginContainer;
