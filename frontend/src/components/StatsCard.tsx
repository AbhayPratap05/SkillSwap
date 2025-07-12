import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import type { SvgIconProps } from '@mui/material';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement<SvgIconProps>;
  color?: string;
  subtitle?: string;
}

const StatsCard = ({ title, value, icon, color = 'primary.main', subtitle }: StatsCardProps) => {
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: `${color}15`,
              color,
              mr: 2,
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard; 