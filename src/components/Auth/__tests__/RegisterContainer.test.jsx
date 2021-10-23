import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderWithRedux, fireEvent, waitFor } from '../../../utils/testUtils';
import RegisterContainer from '../RegisterContainer';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => {
      return {
        push: mockHistoryPush,
      };
    },
  };
});

const handlers = [
  rest.post('http://localhost:5000/api/v1/users', (req, res, ctx) => {
    return res(
      ctx.json({
        userId: '1235',
      }),
      ctx.delay(150)
    );
  }),
];

const server = setupServer(...handlers);

describe('Register container test', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  afterEach(() => server.restoreHandlers());

  const renderComponent = () => {
    return renderWithRedux(<RegisterContainer />);
  };

  it('should contain first, middle and last name input field', () => {
    const { getByPlaceholderText } = renderComponent();

    expect(getByPlaceholderText('Enter first name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter middle name')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter last name')).toBeInTheDocument();
  });

  it('should contain email and password input field', () => {
    const { getByPlaceholderText } = renderComponent();

    expect(getByPlaceholderText('Enter email address')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('should allow user to enter text in first, middle and last name input fields', async () => {
    const { getByPlaceholderText, findByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter first name'), {
      target: { value: 'first name' },
    });

    fireEvent.change(getByPlaceholderText('Enter last name'), {
      target: { value: 'last name' },
    });

    fireEvent.change(getByPlaceholderText('Enter middle name'), {
      target: { value: 'middle name' },
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

  it('should allow user to enter text in email and passowrd fields', async () => {
    const { getByPlaceholderText, findByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'amol@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'some valid pass' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'amol@gmail.com'
    );
    expect(await findByPlaceholderText('Enter password')).toHaveValue(
      'some valid pass'
    );
  });

  it('should show required validation when user check on register button', async () => {
    const { getByText, findByText } = renderComponent();

    fireEvent.submit(getByText('Register'));

    expect(await findByText('First name is required')).toBeInTheDocument();
    expect(getByText('Email is required')).toBeInTheDocument();
    expect(getByText('Password is required')).toBeInTheDocument();
  });

  it('show invalid email error message', async () => {
    const { getByText, findByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'emailinvalid' },
    });

    fireEvent.submit(getByText('Register'));

    expect(await findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('show minimum character error message for password', async () => {
    const { getByText, findByText, getByPlaceholderText } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'pass' },
    });

    fireEvent.submit(getByText('Register'));

    expect(
      await findByText('Password should be of minimum 8 char length')
    ).toBeInTheDocument();
  });

  it('should able to redirect user to login page', async () => {
    const { getByPlaceholderText, findByPlaceholderText, getByText } =
      renderComponent();

    fireEvent.change(getByPlaceholderText('Enter first name'), {
      target: { value: 'firstname' },
    });

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'emailaddress@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'validpassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'emailaddress@gmail.com'
    );

    fireEvent.submit(getByText('Register'));

    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/login'));
  });

  it('show error message when register call failed', async () => {
    server.use(
      rest.post('http://localhost:5000/api/v1/users', (req, res, ctx) => {
        return res.once(
          ctx.status(500),
          ctx.json({ messsage: 'error occured' })
        );
      })
    );

    const {
      findByRole,
      getByPlaceholderText,
      findByPlaceholderText,
      getByText,
    } = renderComponent();

    fireEvent.change(getByPlaceholderText('Enter first name'), {
      target: { value: 'firstname' },
    });

    fireEvent.change(getByPlaceholderText('Enter email address'), {
      target: { value: 'emailaddress@gmail.com' },
    });

    fireEvent.change(getByPlaceholderText('Enter password'), {
      target: { value: 'validpassword' },
    });

    expect(await findByPlaceholderText('Enter email address')).toHaveValue(
      'emailaddress@gmail.com'
    );

    fireEvent.submit(getByText('Register'));

    expect(await findByRole('alert')).toBeInTheDocument();

    expect(mockHistoryPush).not.toHaveBeenCalledWith('/login');
  });
});
