import React from 'react';
import { Paper, styled, Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

const StyledPaper = styled(Paper)({
  padding: '1em',
  marginBottom: '1em',
  marginTop: '2em',
});

const JobLoadingSkeleton = () => {
  return (
    <StyledPaper data-testid='job-container-loading'>
      <Grid container>
        <Grid item xs={9}>
          <Skeleton variant='text' height='30px' />
          <Skeleton variant='rect' height='100px' />
          <Skeleton variant='text' height='30px' />
        </Grid>
        <Grid item xs={1}></Grid>
        <Grid item xs={2}>
          <Skeleton variant='rect' height='160px' />
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default JobLoadingSkeleton;
