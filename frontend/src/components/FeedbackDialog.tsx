import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import Rating from './Rating';

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (feedback: { rating: number; comment: string }) => void;
  title?: string;
}

const FeedbackDialog = ({
  open,
  onClose,
  onSubmit,
  title = 'Give Feedback',
}: FeedbackDialogProps) => {
  const [rating, setRating] = useState<number | null>(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating === null) return;
    onSubmit({ rating, comment });
    handleClose();
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography gutterBottom>Rating</Typography>
          <Rating
            value={rating || 0}
            onChange={(newValue) => setRating(newValue)}
            showCount={false}
          />
        </Box>
        <TextField
          autoFocus
          margin="dense"
          label="Comment"
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={rating === null}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackDialog; 