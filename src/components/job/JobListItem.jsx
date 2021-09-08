import React from 'react';
import { Paper, Grid, Typography, Badge, Button, Box } from '@material-ui/core';
import { VerifiedUser } from '@material-ui/icons';
import { styled } from '@material-ui/core/styles';

const StyledPaper = styled(Paper)({
  padding: '1em',
});

const SkillView = styled(Typography)({
  color: '#333131',
  fontSize: '1.2em',
  fontWeight: 'bold',
  margin: '10px 0px',
});

const DateView = styled(Typography)({
  marginRight: '1em',
  color: '#898686',
  fontSize: '1.2em',
  fontWeight: 600,
});

const StyledVerifiedUser = styled(VerifiedUser)({
  color: '#17d917',
  marginLeft: '1em',
  fontSize: '1em',
});

const BudgetView = styled(Typography)({
  textAlign: 'center',
});

const BidButton = styled(Button)({
  width: '100%',
});

const JobListItem = ({ job }) => {
  return (
    <StyledPaper elevation={2}>
      <Grid container>
        <Grid item xs={9}>
          <Typography variant='h5' component='h1' gutterBottom>
            {job.title}
            <Badge component='span'>
              <StyledVerifiedUser />
            </Badge>
          </Typography>
          <Typography variant='body1' gutterBottom>
            {job.description}
          </Typography>
          <SkillView variant='body1' gutterBottom>
            {job.skills}
          </SkillView>
          <DateView variant='body1' component='span'>
            Posted Date: {job.createdAt}
          </DateView>
          <DateView variant='body1' component='span'>
            Expired Date: {job.expiredAt}
          </DateView>
        </Grid>
        <Grid item xs={3}>
          <Box ml={5}>
            <BudgetView>{`$${job.minBudget} - $${job.maxBudget}`}</BudgetView>
            <BidButton variant='text' color='secondary'>
              Place Bid
            </BidButton>
          </Box>
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default JobListItem;
