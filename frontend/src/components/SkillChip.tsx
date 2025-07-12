import { Chip, type ChipProps } from '@mui/material';

interface SkillChipProps extends Omit<ChipProps, 'label'> {
  skill: string;
  type?: 'offered' | 'wanted';
}

const SkillChip = ({ skill, type = 'offered', ...props }: SkillChipProps) => {
  const getColor = () => {
    switch (type) {
      case 'offered':
        return 'primary';
      case 'wanted':
        return 'secondary';
      default:
        return undefined;
    }
  };

  return (
    <Chip
      label={skill}
      color={getColor()}
      variant="outlined"
      size="small"
      {...props}
    />
  );
};

export default SkillChip; 