import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Box, styled } from '@material-ui/core';
import { selectAllJobs, fetchJobs } from '../../features/job/jobSlice';
import JobList from './JobList';
import JobLoadingSkeleton from './JobLoadingSkeleton';

const StyledBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'row',
  marginTop: '4em',
});

const StyledButton = styled(Button)({
  width: '20%',
  height: '4em',
});

const JobContainer = () => {
  const [filter, setFilter] = useState({ limit: 10, offset: 0 });

  const dispatch = useDispatch();
  const jobs = useSelector(selectAllJobs);

  const jobStatus = useSelector((state) => state.jobs.status);

  useEffect(() => {
    dispatch(fetchJobs(filter));
  }, [dispatch, filter]);

  const fetchMoreJobs = () => {
    const { limit, offset } = filter;
    setFilter({ limit, offset: limit + offset });
  };

  const getView = () => {
    if (jobStatus === 'failed') {
      return <div>Something went wrong!</div>;
    }

    return (
      <>
        <JobList jobs={jobs} />
        {jobStatus === 'loading' && <JobLoadingSkeleton />}
        {jobs.length !== 0 && (
          <StyledBox>
            <StyledButton
              data-testid='load-more-btn'
              variant='contained'
              color='primary'
              disabled={jobStatus === 'loading'}
              onClick={fetchMoreJobs}
            >
              Load More
            </StyledButton>
          </StyledBox>
        )}
      </>
    );
  };

  return <>{getView()}</>;
};

export default JobContainer;
