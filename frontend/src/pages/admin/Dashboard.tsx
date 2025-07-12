import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { getStats } from '../../features/admin/adminSlice';
import {
  Container,
  Box,
  Typography,
  Grid as MuiGrid,
  Paper,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import BlockIcon from '@mui/icons-material/Block';
import StarIcon from '@mui/icons-material/Star';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import StatsCard from '../../components/StatsCard';

const Grid = MuiGrid as any; // Temporary type fix

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, isLoading, isError, message } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(getStats() as any);
  }, [dispatch]);

  if (isLoading || !stats) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Users"
              value={stats.users.total}
              icon={<PeopleIcon />}
              color="primary.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Total Swaps"
              value={stats.swaps.total}
              icon={<SwapHorizIcon />}
              color="success.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Banned Users"
              value={stats.users.banned}
              icon={<BlockIcon />}
              color="error.main"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatsCard
              title="Average Rating"
              value={stats.platform.averageRating.toFixed(1)}
              icon={<StarIcon />}
              color="warning.main"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Swap Status Distribution
              </Typography>
              <Box sx={{ mt: 2 }}>
                {stats.swaps.byStatus.map((status) => (
                  <Box
                    key={status._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography
                      sx={{ textTransform: 'capitalize' }}
                      color="text.secondary"
                    >
                      {status._id}
                    </Typography>
                    <Typography>{status.count}</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Top Skills
              </Typography>
              <Box sx={{ mt: 2 }}>
                {stats.platform.topSkills.map((skill) => (
                  <Box
                    key={skill._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography color="text.secondary">{skill._id}</Typography>
                    <Typography>{skill.count} users</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {isError && (
        <Alert
          open={isError}
          message={message}
          severity="error"
          onClose={() => {}}
        />
      )}
    </Container>
  );
};

export default Dashboard; 