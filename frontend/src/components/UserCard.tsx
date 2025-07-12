import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Avatar,
  Box,
  Button,
  Stack,
} from '@mui/material';
import Rating from './Rating';
import SkillChip from './SkillChip';

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    profilePhoto?: string;
    skillsOffered: string[];
    skillsWanted: string[];
    rating: number;
    totalRatings: number;
  };
  onRequestSwap?: () => void;
  showActions?: boolean;
}

const UserCard = ({ user, onRequestSwap, showActions = true }: UserCardProps) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Avatar
            src={user.profilePhoto}
            alt={user.name}
            sx={{ width: 56, height: 56 }}
          />
          <Box>
            <Typography variant="h6" component={RouterLink} to={`/users/${user._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
              {user.name}
            </Typography>
            <Rating value={user.rating} totalRatings={user.totalRatings} readOnly size="small" />
          </Box>
        </Box>

        <Stack spacing={1}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Skills Offered
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.skillsOffered.map((skill) => (
                <SkillChip key={skill} skill={skill} type="offered" />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Skills Wanted
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {user.skillsWanted.map((skill) => (
                <SkillChip key={skill} skill={skill} type="wanted" />
              ))}
            </Box>
          </Box>
        </Stack>
      </CardContent>

      {showActions && (
        <CardActions>
          <Button
            component={RouterLink}
            to={`/users/${user._id}`}
            size="small"
            color="primary"
          >
            View Profile
          </Button>
          {onRequestSwap && (
            <Button
              size="small"
              color="primary"
              variant="contained"
              onClick={onRequestSwap}
            >
              Request Swap
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};

export default UserCard; 