import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderWithRedux, fireEvent, waitFor } from '../../../utils/testUtils';
import RegisterContainer from '../RegisterContainer';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

const handlers = [
  rest.post('http://localhost:5000/api/v1/users', (req, res, ctx) => {
    return res(
      ctx.json({
        userId: '12345',
      }),
      ctx.delay(150)
    );
  }),
];

const server = setupServer(...handlers);

describe('Regsiter container test', () => {
  beforeAll(() => server.listen());

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  const renderComponent = () => {
    return renderWithRedux(<RegisterContainer />);
  };

  it('should render first name , middle name and last name input fields', () => {
    const { getByPlaceholderText } = renderComponent();

    expect(getByPlaceholderText('Enter first name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter middle name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter last name')).toBeInTheDocument();
  });

  it('should allow user to enter value in first name , middle name and last name input fields', async () => {
    const { getByPlaceholderText, findByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter first name'), {
      target: { value: 'first name' },
    });

    fireEvent.change(getByPlaceholderText('Enter middle name'), {
      target: { value: 'middle name' },
    });

    fireEvent.change(getByPlaceholderText('Enter last name'), {
      target: { value: 'last name' },
    });

    expect(await findByPlaceholderText('Enter first name')).toHaveValue(
      'first name'
    );
    expect(await findByPlaceholderText('Enter middle name')).toHaveValue(
      'middle name'
    );
    expect(await findByPlaceholderText('Enter last name')).toHaveValue(
      'last name'
    );
  });

  it('should contain email, password and register button', () => {
    const { getByPlaceholderText, getByText } = renderComponent();

    expect(getByPlaceholderText('Enter email address')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(getByText('Register')).toBeInTheDocument();
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

  it('should show required validation when user click on register button', async () => {
    const { getByText, findByText } = renderComponent();

    fireEvent.submit(getByText('Register'));

    expect(await findByText('First name is required')).toBeInTheDocument();
    expect(getByText('Email is required')).toBeInTheDocument();
    expect(await findByText('Password is required')).toBeInTheDocument();
  });

  it('should show invalid email message when user entered invalid email', async () => {
    const { getByText, findByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'emailinvalid' },
    });

    fireEvent.submit(getByText('Register'));

    expect(await findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('should show invalid password message', async () => {
    const { getByText, findByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'pass' },
    });

    fireEvent.submit(getByText('Register'));

    expect(
      await findByText('Password should be of minimum 8 char length')
    ).toBeInTheDocument();
  });

  it('should able to navigate to login route and when user click on regsiter with valid data', async () => {
    const { getByPlaceholderText, findByPlaceholderText, getByText } =
      renderComponent();

    fireEvent.change(getByPlaceholderText('Enter first name'), {
      target: { value: 'first name' },
    });

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'email@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'somevalidpassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'email@gmail.com'
    );

    fireEvent.submit(getByText('Register'));

    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/login'));
  });

  it('should show error message and when server send error', async () => {
    server.use(
      rest.post('http://localhost:5000/api/v1/users', (req, res, ctx) => {
        return res.once(ctx.status(500), ctx.json({ mesage: 'network error' }));
      })
    );
    const {
      getByPlaceholderText,
      findByPlaceholderText,
      getByText,
      findByRole,
    } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter first name'), {
      target: { value: 'first name' },
    });

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'email@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'somevalidpassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'email@gmail.com'
    );

    fireEvent.submit(getByText('Register'));

    expect(await findByRole('alert')).toBeInTheDocument();

    expect(mockHistoryPush).not.toHaveBeenCalledWith('/login');
  });
});
