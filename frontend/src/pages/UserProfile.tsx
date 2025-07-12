import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { getUserById, reset } from '../features/users/userSlice';
import { createSwapRequest } from '../features/swaps/swapSlice';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  Grid as MuiGrid,
  Divider,
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import Rating from '../components/Rating';
import SkillChip from '../components/SkillChip';
import SwapRequestDialog from '../components/SwapRequestDialog';

const Grid = MuiGrid as any; // Temporary type fix

interface User {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  location?: string;
  availability: string;
  skillsOffered: string[];
  skillsWanted: string[];
  rating: number;
  totalRatings: number;
  isPublic: boolean;
}

interface AuthUser {
  _id: string;
  name: string;
  email: string;
  skillsOffered: string[];
  skillsWanted: string[];
  token: string;
}

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [showSwapDialog, setShowSwapDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const dispatch = useDispatch();
  const { selectedUser, isLoading, isError, message } = useSelector(
    (state: RootState) => state.users
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth) as { user: AuthUser | null };

  useEffect(() => {
    if (id) {
      dispatch(getUserById(id) as any);
    }

    return () => {
      dispatch(reset());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (isError) {
      setAlertMessage(message);
      setAlertSeverity('error');
      setShowAlert(true);
    }
  }, [isError, message]);

  const handleSwapRequest = (data: {
    skillOffered: string;
    skillWanted: string;
    message: string;
  }) => {
    if (!selectedUser) return;

    dispatch(
      createSwapRequest({
        recipientId: selectedUser._id,
        ...data,
      }) as any
    )
      .unwrap()
      .then(() => {
        setAlertMessage('Swap request sent successfully');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch(() => {
        setAlertMessage('Failed to send swap request');
        setAlertSeverity('error');
        setShowAlert(true);
      });
  };

  if (isLoading || !selectedUser) {
    return <LoadingSpinner />;
  }

  const isOwnProfile = currentUser?._id === selectedUser._id;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  src={selectedUser.profilePhoto}
                  alt={selectedUser.name}
                  sx={{ width: 200, height: 200, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  {selectedUser.name}
                </Typography>
                <Rating
                  value={selectedUser.rating}
                  totalRatings={selectedUser.totalRatings}
                  readOnly
                />
                {!isOwnProfile && (
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => setShowSwapDialog(true)}
                  >
                    Request Skill Swap
                  </Button>
                )}
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              {selectedUser.location && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Location
                  </Typography>
                  <Typography>{selectedUser.location}</Typography>
                </Box>
              )}

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Availability
                </Typography>
                <Typography>{selectedUser.availability}</Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Skills Offered
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedUser.skillsOffered.map((skill) => (
                    <SkillChip key={skill} skill={skill} type="offered" />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Skills Wanted
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {selectedUser.skillsWanted.map((skill) => (
                    <SkillChip key={skill} skill={skill} type="wanted" />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {selectedUser && (
        <SwapRequestDialog
          open={showSwapDialog}
          onClose={() => setShowSwapDialog(false)}
          onSubmit={handleSwapRequest}
          skillsOffered={currentUser?.skillsOffered || []}
          skillsWanted={currentUser?.skillsWanted || []}
          recipientName={selectedUser.name}
        />
      )}

      <Alert
        open={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setShowAlert(false)}
      />
    </Container>
  );
};

export default UserProfile; 