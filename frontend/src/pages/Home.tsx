import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { searchUsers, clearSearchResults } from '../features/users/userSlice';
import {
  Container,
  Box,
  Typography,
  Grid as MuiGrid,
  Paper,
} from '@mui/material';
import LoadingSpinner from '../components/LoadingSpinner';
import Alert from '../components/Alert';
import SearchBar from '../components/SearchBar';
import UserCard from '../components/UserCard';

const Grid = MuiGrid as any; // Temporary type fix

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'offered' | 'wanted'>('all');
  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();
  const { searchResults, isLoading, isError, message } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    if (isError) {
      setShowAlert(true);
    }
  }, [isError]);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    dispatch(
      searchUsers({
        skill: searchTerm,
        type: searchType === 'all' ? undefined : searchType,
      }) as any
    );
  };

  const handleClear = () => {
    setSearchTerm('');
    dispatch(clearSearchResults());
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Find Your Next Skill Exchange
        </Typography>
        <Typography variant="h6" color="text.secondary" align="center" gutterBottom>
          Connect with others to share knowledge and learn something new
        </Typography>

        <Paper sx={{ p: 3, mt: 4 }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            onClear={handleClear}
            searchType={searchType}
            onSearchTypeChange={setSearchType}
            placeholder="Search for skills (e.g., 'Python', 'Photography')"
          />
        </Paper>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Box sx={{ mt: 4 }}>
            {searchResults.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Search Results ({searchResults.length})
                </Typography>
                <Grid container spacing={3}>
                  {searchResults.map((user) => (
                    <Grid item xs={12} sm={6} md={4} key={user._id}>
                      <UserCard user={user} />
                    </Grid>
                  ))}
                </Grid>
              </>
            ) : searchTerm ? (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No users found matching your search criteria
                </Typography>
                <Typography color="text.secondary">
                  Try adjusting your search terms or filters
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Start by searching for a skill you want to learn or teach
                </Typography>
                <Typography color="text.secondary">
                  You can search in all skills or filter by skills offered/wanted
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </Box>

      <Alert
        open={showAlert}
        message={message}
        severity="error"
        onClose={() => setShowAlert(false)}
      />
    </Container>
  );
};

export default Home; 