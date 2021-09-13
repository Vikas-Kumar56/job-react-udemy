import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { render, fireEvent, waitFor } from '../../../utils/testUtils';
import LoginContainer from '../LoginContainer';
import AuthProvider from '../AuthProvider';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE3MmU4MWQ2LTYyZjYtNDQxMS04ZTE5LWVlYmZlMjRjNzI1MCIsInVzZXJuYW1lIjoicGV0ZXIgc21pdGgiLCJlbWFpbCI6ImVtYWlsMjJAZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMTAvMDkvMjAyMSIsInVwZGF0ZWRBdCI6IjEwLzA5LzIwMjEiLCJ2ZXJzaW9uIjoiYTZmOGQ3NjctMmI4YS00ZjY1LTk1MTAtZDJmYWY5YmM4MWZhIiwiaWF0IjoxNjMxNDY4NDk3fQ.NhKFEKcq-diCy4mtni5o6dTYUVtCrtPv9tGFpl6Tt8Y`;

const handlers = [
  rest.post('http://localhost:5000/api/v1/users/login', (req, res, ctx) => {
    return res(
      ctx.json({
        token,
      }),
      ctx.delay(150)
    );
  }),
];

const server = setupServer(...handlers);

describe('Login Container test', () => {
  beforeAll(() => server.listen());

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  const renderComponent = () => {
    return render(
      <AuthProvider>
        <LoginContainer />
      </AuthProvider>
    );
  };

  it('should contain email, password and login button', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText('Enter email address')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(getByText('Login')).toBeInTheDocument();
  });

  it('should allow user to enter email and password', async () => {
    const { getByPlaceholderText, findByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'email@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'somevalidpassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'email@gmail.com'
    );
    expect(await findByPlaceholderText('Enter password')).toHaveValue(
      'somevalidpassword'
    );
  });

  it('should show required validation when user click on login button', async () => {
    const { getByText, findByText } = renderComponent();

    fireEvent.submit(getByText('Login'));

    expect(await findByText('Email is required')).toBeInTheDocument();
    expect(await findByText('Password is required')).toBeInTheDocument();
  });

  it('should show invalid email message when user entered invalid email', async () => {
    const { getByText, findByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'emailinvalid' },
    });

    fireEvent.submit(getByText('Login'));

    expect(await findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('should show invalid password message', async () => {
    const { getByText, findByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'pass' },
    });

    fireEvent.submit(getByText('Login'));

    expect(
      await findByText('Password should be of minimum 8 char length')
    ).toBeInTheDocument();
  });

  it('should able to navigate to default route and save token to local storage', async () => {
    const { getByPlaceholderText, findByPlaceholderText, getByText } =
      renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'email@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'somevalidpassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'email@gmail.com'
    );

    fireEvent.submit(getByText('Login'));

    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/'));

    const jwt = localStorage.getItem(window.location.origin);

    expect(jwt).toEqual(token);
  });
});
