import { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface SkillInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  label: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
}

const SkillInput = ({
  skills,
  onChange,
  label,
  placeholder = 'Add a skill',
  error,
  helperText,
}: SkillInputProps) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddSkill = () => {
    if (!inputValue.trim()) return;
    
    const newSkill = inputValue.trim();
    if (!skills.includes(newSkill)) {
      onChange([...skills, newSkill]);
    }
    setInputValue('');
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    onChange(skills.filter((skill) => skill !== skillToDelete));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddSkill();
    }
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      
      <TextField
        fullWidth
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        error={error}
        helperText={helperText}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={handleAddSkill}
                disabled={!inputValue.trim()}
                edge="end"
              >
                <AddIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
        {skills.map((skill) => (
          <Chip
            key={skill}
            label={skill}
            onDelete={() => handleDeleteSkill(skill)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default SkillInput; 