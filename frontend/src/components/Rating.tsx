import { Rating as MuiRating, Box, Typography } from '@mui/material';

interface RatingProps {
  value: number;
  totalRatings?: number;
  onChange?: (value: number | null) => void;
  readOnly?: boolean;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

const Rating = ({
  value,
  totalRatings,
  onChange,
  readOnly = false,
  size = 'medium',
  showCount = true,
}: RatingProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <MuiRating
        value={value}
        onChange={(_, newValue) => onChange?.(newValue)}
        readOnly={readOnly}
        size={size}
        precision={0.5}
      />
      {showCount && totalRatings !== undefined && (
        <Typography variant="body2" color="text.secondary">
          ({totalRatings})
        </Typography>
      )}
    </Box>
  );
};

export default Rating; 