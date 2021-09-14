import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  styled,
  Snackbar,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../../features/user/userSlice';
import { Alert } from '@material-ui/lab';

const StyledPaper = styled(Paper)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const Heading = styled(Typography)({
  padding: '10px',
  fontSize: '2em',
  fontWeight: 'bold',
  marginBottom: '20px',
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  width: '30%',
});

const RegisterButton = styled(Button)({
  marginBottom: '100px',
  width: '30%',
});

const validationSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string(),
  middleName: yup.string(),
  email: yup
    .string('Enter email address')
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string('Enter password')
    .required('Password is required')
    .min(8, 'Password should be of minimum 8 char length'),
});

const RegisterContainer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [error, setError] = useState(null);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(registerUser(values))
        .unwrap()
        .then(() => {
          history.push('/login');
        })
        .catch((error) => {
          setError(error.message);
        });
    },
  });

  const snackbarErrorView = () => {
    return (
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={error !== null}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity='error'>
          {error}
        </Alert>
      </Snackbar>
    );
  };

  return (
    <>
      <form autoComplete='off' noValidate onSubmit={formik.handleSubmit}>
        <StyledPaper>
          <Heading variant='h4'>User Registration</Heading>
          <StyledTextField
            name='firstName'
            id='firstName'
            label='Enter first name'
            variant='outlined'
            placeholder='Enter first name'
            value={formik.values.firstName}
            onChange={formik.handleChange}
            helperText={formik.touched.firstName && formik.errors.firstName}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
          />
          <StyledTextField
            name='middleName'
            id='middleName'
            label='Enter middle name'
            variant='outlined'
            placeholder='Enter middle name'
            value={formik.values.middleName}
            onChange={formik.handleChange}
            helperText={formik.touched.middleName && formik.errors.middleName}
            error={
              formik.touched.middleName && Boolean(formik.errors.middleName)
            }
          />
          <StyledTextField
            name='lastName'
            id='lastName'
            label='Enter last name'
            variant='outlined'
            placeholder='Enter last name'
            value={formik.values.lastName}
            onChange={formik.handleChange}
            helperText={formik.touched.lastName && formik.errors.lastName}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
          />
          <StyledTextField
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
          <StyledTextField
            type='password'
            name='password'
            id='password'
            label='Enter password'
            variant='outlined'
            placeholder='Enter password'
            value={formik.values.password}
            onChange={formik.handleChange}
            helperText={formik.touched.password && formik.errors.password}
            error={formik.touched.password && Boolean(formik.errors.password)}
          />
          <RegisterButton type='submit' variant='contained' color='primary'>
            Register
          </RegisterButton>
        </StyledPaper>
      </form>
      {snackbarErrorView()}
    </>
  );
};

export default RegisterContainer;
