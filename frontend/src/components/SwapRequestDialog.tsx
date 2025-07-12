import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from '@mui/material';

interface SwapRequestDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { skillOffered: string; skillWanted: string; message: string }) => void;
  skillsOffered: string[];
  skillsWanted: string[];
  recipientName: string;
}

const SwapRequestDialog = ({
  open,
  onClose,
  onSubmit,
  skillsOffered,
  skillsWanted,
  recipientName,
}: SwapRequestDialogProps) => {
  const [skillOffered, setSkillOffered] = useState('');
  const [skillWanted, setSkillWanted] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    onSubmit({ skillOffered, skillWanted, message });
    handleClose();
  };

  const handleClose = () => {
    setSkillOffered('');
    setSkillWanted('');
    setMessage('');
    onClose();
  };

  const isValid = skillOffered && skillWanted;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Request Skill Swap with {recipientName}</DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Choose a skill to offer and a skill you want in return
          </Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Skill to Offer</InputLabel>
            <Select
              value={skillOffered}
              label="Skill to Offer"
              onChange={(e) => setSkillOffered(e.target.value)}
            >
              {skillsOffered.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Skill Wanted</InputLabel>
            <Select
              value={skillWanted}
              label="Skill Wanted"
              onChange={(e) => setSkillWanted(e.target.value)}
            >
              {skillsWanted.map((skill) => (
                <MenuItem key={skill} value={skill}>
                  {skill}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Message (Optional)"
            fullWidth
            multiline
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message to explain what you're looking to learn or teach..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary" disabled={!isValid}>
          Send Request
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SwapRequestDialog; 