import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { renderWithRedux, fireEvent } from '../../../utils/testUtils';
import JobContainer from '../JobContainer';

const handlers = [
  rest.get('http://localhost:5000/api/v1/jobs', (req, res, ctx) => {
    const offset = req.url.searchParams.get('offset');
    if (+offset === 0) {
      return res(
        ctx.json({
          jobs: [
            {
              createdAt: '14/08/2021',
              description: 'description',
              expiredAt: '2022-10-10T00:00:00.000Z',
              id: 'b8d86ffc-da29-4bf5-9d72-f4bd1b76d89a',
              maxBudget: '200',
              minBudget: '100',
              skills: 'skills',
              title: 'title test',
              updatedAt: '14/08/2021',
              userId: 'ef3a51a3-642a-4230-9a01-ecd475e72f07',
              version: 'ede2bf46-d06a-4d1f-b756-b718de36165b',
            },
          ],
        }),
        ctx.delay(150)
      );
    }
    return res(
      ctx.json({
        jobs: [
          {
            createdAt: '14/08/2021',
            description: 'description - 2',
            expiredAt: '2022-10-10T00:00:00.000Z',
            id: 'b8d86ffc-da29-4bf5-9d72-f4bd1b76d89b',
            maxBudget: '200',
            minBudget: '100',
            skills: 'skills',
            title: 'title test - 2',
            updatedAt: '14/08/2021',
            userId: 'ef3a51a3-642a-4230-9a01-ecd475e72f07',
            version: 'ede2bf46-d06a-4d1f-b756-b718de36165b',
          },
        ],
      }),
      ctx.delay(150)
    );
  }),
];

const server = setupServer(...handlers);

describe('JobContainer', () => {
  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  it('should show loader when request is pending', () => {
    const { getByTestId, asFragment } = renderWithRedux(<JobContainer />);

    expect(getByTestId('job-container-loading')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render jobList', async () => {
    const { findByText, asFragment } = renderWithRedux(<JobContainer />);

    expect(await findByText('title test')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();
  });

  it('should load more jobs when click on load more button', async () => {
    const { findByText, getByText, asFragment, getByTestId, queryByTestId } =
      renderWithRedux(<JobContainer />);
    expect(await findByText('title test')).toBeInTheDocument();

    fireEvent.click(getByText('Load More'));
    expect(getByTestId('load-more-btn')).toBeDisabled();
    expect(getByTestId('job-container-loading')).toBeInTheDocument();

    expect(await findByText('title test - 2')).toBeInTheDocument();
    expect(asFragment()).toMatchSnapshot();

    expect(getByTestId('load-more-btn')).not.toBeDisabled();
    expect(queryByTestId('job-container-loading')).not.toBeInTheDocument();
  });

  it('should handle server error', async () => {
    server.use(
      rest.get('http://localhost:5000/api/v1/jobs', (req, res, ctx) => {
        return res.once(
          ctx.status(500),
          ctx.json({ mesage: 'server is not working!' })
        );
      })
    );

    const { findByText } = renderWithRedux(<JobContainer />);

    expect(await findByText('Something went wrong!')).toBeInTheDocument();
  });
});
