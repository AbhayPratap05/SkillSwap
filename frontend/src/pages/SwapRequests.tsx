import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import {
  getSwapRequests,
  updateSwapStatus,
  addFeedback,
  deleteSwapRequest,
} from '../features/swaps/swapSlice';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Stack,
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SwapRequestCard from '../components/SwapRequestCard';
import FeedbackDialog from '../components/FeedbackDialog';
import ConfirmDialog from '../components/ConfirmDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`swap-tabpanel-${index}`}
      aria-labelledby={`swap-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const SwapRequests = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [selectedSwap, setSelectedSwap] = useState<string | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const dispatch = useDispatch();
  const { swaps, isLoading, isError, message } = useSelector(
    (state: RootState) => state.swaps
  );
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        console.log('Fetching swaps...');
        console.log('Current auth user:', user);
        await dispatch(getSwapRequests() as any).unwrap();
        console.log('Swaps fetched successfully:', swaps);
      } catch (error: any) {
        console.error('Error fetching swaps:', error);
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load swap requests';
        setAlertMessage(errorMessage);
        setAlertSeverity('error');
        setShowAlert(true);
      } finally {
        setIsInitialLoad(false);
      }
    };

    if (user) {
      fetchSwaps();
    } else {
      console.log('No user found in auth state');
      setAlertMessage('Please log in to view your swap requests');
      setAlertSeverity('error');
      setShowAlert(true);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isError) {
      console.error('Swap request error:', message);
      setAlertMessage(message);
      setAlertSeverity('error');
      setShowAlert(true);
    }
  }, [isError, message]);

  console.log('Current swaps state:', { swaps, isLoading, isError, message });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAccept = (swapId: string) => {
    dispatch(updateSwapStatus({ swapId, status: 'accepted' }) as any)
      .unwrap()
      .then(() => {
        setAlertMessage('Swap request accepted');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch(() => {
        setAlertMessage('Failed to accept swap request');
        setAlertSeverity('error');
        setShowAlert(true);
      });
  };

  const handleReject = (swapId: string) => {
    dispatch(updateSwapStatus({ swapId, status: 'rejected' }) as any)
      .unwrap()
      .then(() => {
        setAlertMessage('Swap request rejected');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch(() => {
        setAlertMessage('Failed to reject swap request');
        setAlertSeverity('error');
        setShowAlert(true);
      });
  };

  const handleDelete = () => {
    if (!selectedSwap) return;

    dispatch(deleteSwapRequest(selectedSwap) as any)
      .unwrap()
      .then(() => {
        setAlertMessage('Swap request deleted');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch(() => {
        setAlertMessage('Failed to delete swap request');
        setAlertSeverity('error');
        setShowAlert(true);
      });

    setShowDeleteConfirm(false);
    setSelectedSwap(null);
  };

  const handleFeedback = (feedback: { rating: number; comment: string }) => {
    if (!selectedSwap) return;

    dispatch(addFeedback({ swapId: selectedSwap, feedback }) as any)
      .unwrap()
      .then(() => {
        setAlertMessage('Feedback submitted successfully');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch(() => {
        setAlertMessage('Failed to submit feedback');
        setAlertSeverity('error');
        setShowAlert(true);
      });

    setShowFeedbackDialog(false);
    setSelectedSwap(null);
  };

  const filteredSwaps = swaps.filter((swap) => {
    switch (tabValue) {
      case 0: // All
        return true;
      case 1: // Pending
        return swap.status === 'pending';
      case 2: // Active
        return swap.status === 'accepted';
      case 3: // Completed
        return (
          swap.status === 'accepted' &&
          swap.feedback?.fromRequestor &&
          swap.feedback?.fromRecipient
        );
      default:
        return false;
    }
  });

  if (isInitialLoad || (isLoading && !swaps.length)) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">
            Please log in to view your swap requests
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Skill Swap Requests
        </Typography>

        <Paper sx={{ mt: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="All" />
            <Tab label="Pending" />
            <Tab label="Active" />
            <Tab label="Completed" />
          </Tabs>

          <TabPanel value={tabValue} index={tabValue}>
            {filteredSwaps.length > 0 ? (
              <Stack spacing={2}>
                {filteredSwaps.map((swap) => (
                  <SwapRequestCard
                    key={swap._id}
                    swap={swap}
                    currentUserId={user?._id || ''}
                    onAccept={() => handleAccept(swap._id)}
                    onReject={() => handleReject(swap._id)}
                    onDelete={() => {
                      setSelectedSwap(swap._id);
                      setShowDeleteConfirm(true);
                    }}
                    onGiveFeedback={() => {
                      setSelectedSwap(swap._id);
                      setShowFeedbackDialog(true);
                    }}
                  />
                ))}
              </Stack>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="text.secondary">
                  No swap requests found in this category
                </Typography>
              </Box>
            )}
          </TabPanel>
        </Paper>
      </Box>

      <FeedbackDialog
        open={showFeedbackDialog}
        onClose={() => {
          setShowFeedbackDialog(false);
          setSelectedSwap(null);
        }}
        onSubmit={handleFeedback}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Swap Request"
        message="Are you sure you want to delete this swap request?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setSelectedSwap(null);
        }}
        severity="error"
      />

      <Alert
        open={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setShowAlert(false)}
      />
    </Container>
  );
};

export default SwapRequests; 