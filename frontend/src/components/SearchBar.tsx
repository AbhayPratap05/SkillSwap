import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  searchType: 'all' | 'offered' | 'wanted';
  onSearchTypeChange: (type: 'all' | 'offered' | 'wanted') => void;
  placeholder?: string;
}

const SearchBar = ({
  value,
  onChange,
  onSearch,
  onClear,
  searchType,
  onSearchTypeChange,
  placeholder = 'Search skills...',
}: SearchBarProps) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch();
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Search in</InputLabel>
        <Select
          value={searchType}
          label="Search in"
          onChange={(e) => onSearchTypeChange(e.target.value as 'all' | 'offered' | 'wanted')}
        >
          <MenuItem value="all">All Skills</MenuItem>
          <MenuItem value="offered">Skills Offered</MenuItem>
          <MenuItem value="wanted">Skills Wanted</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton onClick={onClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar; 