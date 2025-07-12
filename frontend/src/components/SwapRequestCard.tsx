import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  IconButton,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DeleteIcon from '@mui/icons-material/Delete';
import Rating from './Rating';
import ConfirmDialog from './ConfirmDialog';

interface SwapRequestCardProps {
  swap: {
    _id: string;
    requestor: {
      _id: string;
      name: string;
      profilePhoto?: string;
    };
    recipient: {
      _id: string;
      name: string;
      profilePhoto?: string;
    };
    skillOffered: string;
    skillWanted: string;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
    feedback?: {
      fromRequestor?: {
        rating: number;
        comment: string;
      };
      fromRecipient?: {
        rating: number;
        comment: string;
      };
    };
  };
  currentUserId: string;
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
  onGiveFeedback?: () => void;
}

const SwapRequestCard = ({
  swap,
  currentUserId,
  onAccept,
  onReject,
  onDelete,
  onGiveFeedback,
}: SwapRequestCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isRequestor = currentUserId === swap.requestor._id;
  const otherUser = isRequestor ? swap.recipient : swap.requestor;
  
  // Handle deleted/null users
  const userDisplay = otherUser ? {
    name: otherUser.name,
    profilePhoto: otherUser.profilePhoto,
    _id: otherUser._id
  } : {
    name: 'Deleted User',
    profilePhoto: '',
    _id: 'deleted'
  };

  const getStatusColor = () => {
    switch (swap.status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      case 'cancelled':
        return 'warning';
      default:
        return 'info';
    }
  };

  const canGiveFeedback = () => {
    if (swap.status !== 'accepted') return false;
    if (isRequestor && !swap.feedback?.fromRequestor) return true;
    if (!isRequestor && !swap.feedback?.fromRecipient) return true;
    return false;
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              src={userDisplay.profilePhoto}
              alt={userDisplay.name}
              sx={{ width: 56, height: 56 }}
            />
            <Box sx={{ flex: 1 }}>
              {userDisplay._id !== 'deleted' ? (
                <Typography
                  variant="h6"
                  component={RouterLink}
                  to={`/users/${userDisplay._id}`}
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {userDisplay.name}
                </Typography>
              ) : (
                <Typography variant="h6" color="text.secondary">
                  {userDisplay.name}
                </Typography>
              )}
              <Chip
                label={swap.status}
                color={getStatusColor()}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography color="text.secondary">
                {isRequestor ? 'You offer:' : 'They offer:'}
              </Typography>
              <Typography>{swap.skillOffered}</Typography>
              <SwapHorizIcon color="action" />
              <Typography color="text.secondary">
                {isRequestor ? 'You want:' : 'They want:'}
              </Typography>
              <Typography>{swap.skillWanted}</Typography>
            </Box>

            {swap.message && (
              <Typography variant="body2" color="text.secondary">
                Message: {swap.message}
              </Typography>
            )}

            {swap.feedback && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Feedback
                </Typography>
                {swap.feedback.fromRequestor && (
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      From {swap.requestor?.name || 'Deleted User'}:
                    </Typography>
                    <Rating
                      value={swap.feedback.fromRequestor.rating}
                      readOnly
                      size="small"
                      showCount={false}
                    />
                    <Typography variant="body2">
                      {swap.feedback.fromRequestor.comment}
                    </Typography>
                  </Box>
                )}
                {swap.feedback.fromRecipient && swap.recipient && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      From {swap.recipient?.name || 'Deleted User'}:
                    </Typography>
                    <Rating
                      value={swap.feedback.fromRecipient.rating}
                      readOnly
                      size="small"
                      showCount={false}
                    />
                    <Typography variant="body2">
                      {swap.feedback.fromRecipient.comment}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}
          </Stack>
        </CardContent>

        <CardActions>
          {swap.status === 'pending' && !isRequestor && (
            <>
              <Button
                size="small"
                color="primary"
                variant="contained"
                onClick={onAccept}
              >
                Accept
              </Button>
              <Button size="small" color="error" onClick={onReject}>
                Reject
              </Button>
            </>
          )}
          {swap.status === 'pending' && isRequestor && onDelete && (
            <IconButton
              size="small"
              color="error"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <DeleteIcon />
            </IconButton>
          )}
          {canGiveFeedback() && (
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={onGiveFeedback}
            >
              Give Feedback
            </Button>
          )}
        </CardActions>
      </Card>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Swap Request"
        message="Are you sure you want to delete this swap request?"
        confirmText="Delete"
        onConfirm={() => {
          onDelete?.();
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        severity="error"
      />
    </>
  );
};

export default SwapRequestCard; 