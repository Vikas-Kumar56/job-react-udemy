import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  renderWithRedux,
  fireEvent,
  waitFor,
  act,
} from '../../../utils/testUtils';

import AuthProvider from '../AuthProvider';
import LoginContainer from '../LoginContainer';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const handlers = [
  rest.post('http://localhost:5000/api/v1/users/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      }),
      ctx.delay(150)
    );
  }),
];

const server = setupServer(...handlers);

describe('Login Container test', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  const renderComponent = () => {
    return renderWithRedux(
      <AuthProvider>
        <LoginContainer />
      </AuthProvider>
    );
  };

  it('should contain password and email fields', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText('Enter email address')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('should user able to enter value in email and password field', async () => {
    const { getByPlaceholderText, findByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'amol@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'somepassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'amol@gmail.com'
    );
    expect(await findByPlaceholderText('Enter password')).toHaveValue(
      'somepassword'
    );
  });

  it('should show required error message of email and password when user click login btn', async () => {
    const { findByText, getByText } = renderComponent();

    fireEvent.submit(getByText('Login'));
    expect(await findByText('Email is required')).toBeInTheDocument();
    expect(await findByText('Password is required')).toBeInTheDocument();
  });

  it('should show invalid email error message when user click login', async () => {
    const { findByText, getByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'invalid email' },
    });

    fireEvent.submit(getByText('Login'));
    expect(await findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('should show invalid password error message when user click login', async () => {
    const { findByText, getByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'pass' },
    });

    fireEvent.submit(getByText('Login'));
    expect(
      await findByText('Password should be of minimum 8 char length')
    ).toBeInTheDocument();
  });

  // http request testcases
  it('should able to login user and navigate to job page', async () => {
    const { getByPlaceholderText, findByPlaceholderText, getByText } =
      renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'amol@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'somepassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'amol@gmail.com'
    );

    act(() => {
      fireEvent.submit(getByText('Login'));
    });

    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/'));
    const token = localStorage.getItem('job-udemy-app');

    expect(token).toEqual(
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
    );
  });
});
