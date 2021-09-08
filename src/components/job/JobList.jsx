import React from 'react';
import { Grid } from '@material-ui/core';

import JobListItem from './JobListItem';

const JobList = ({ jobs }) => {
  return (
    <Grid container spacing={3}>
      {jobs.map((job) => (
        <Grid item xs={12} key={job.id}>
          <JobListItem job={job} />
        </Grid>
      ))}
    </Grid>
  );
};

export default JobList;
