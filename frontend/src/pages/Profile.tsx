import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { getProfile, updateProfile, reset } from '../features/users/userSlice';
import {
  Container,
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Stack,
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SkillInput from '../components/SkillInput';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    availability: '',
    isPublic: true,
    skillsOffered: [] as string[],
    skillsWanted: [] as string[],
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const dispatch = useDispatch();
  const { profile, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.users
  );

  // Load profile data on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await dispatch(getProfile() as any).unwrap();
      } catch (error) {
        console.error('Failed to load profile:', error);
        setAlertMessage('Failed to load profile data');
        setAlertSeverity('error');
        setShowAlert(true);
      } finally {
        setIsInitialLoad(false);
      }
    };

    if (isInitialLoad) {
      loadProfile();
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, isInitialLoad]);

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        location: profile.location || '',
        availability: profile.availability || '',
        isPublic: profile.isPublic ?? true,
        skillsOffered: profile.skillsOffered || [],
        skillsWanted: profile.skillsWanted || [],
      });
    }
  }, [profile]);

  // Handle success/error messages
  useEffect(() => {
    if (isError) {
      setAlertMessage(message);
      setAlertSeverity('error');
      setShowAlert(true);
    }

    if (isSuccess && message) {
      setAlertMessage('Profile updated successfully');
      setAlertSeverity('success');
      setShowAlert(true);
    }
  }, [isError, isSuccess, message]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData) as any).unwrap();
      setAlertMessage('Profile updated successfully');
      setAlertSeverity('success');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Failed to update profile');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (isInitialLoad || (isLoading && !profile)) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>

        <Paper sx={{ p: 4, mt: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={profile?.profilePhoto}
                  alt={profile?.name}
                  sx={{ width: 100, height: 100 }}
                />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Profile Photo
                  </Typography>
                  <Button variant="outlined" component="label">
                    Upload Photo
                    <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                  </Button>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <TextField
                fullWidth
                label="Location (Optional)"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />

              <TextField
                fullWidth
                label="Availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                placeholder="e.g., Weekends, Evenings"
                helperText="When are you typically available for skill swaps?"
              />

              <SkillInput
                label="Skills You Can Offer"
                skills={formData.skillsOffered}
                onChange={(skills) => setFormData((prev) => ({ ...prev, skillsOffered: skills }))}
                placeholder="Add a skill you can teach"
              />

              <SkillInput
                label="Skills You Want to Learn"
                skills={formData.skillsWanted}
                onChange={(skills) => setFormData((prev) => ({ ...prev, skillsWanted: skills }))}
                placeholder="Add a skill you want to learn"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPublic}
                    onChange={handleChange}
                    name="isPublic"
                  />
                }
                label="Make profile public"
              />

              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>

      <Alert
        open={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setShowAlert(false)}
      />
    </Container>
  );
};

export default Profile; 