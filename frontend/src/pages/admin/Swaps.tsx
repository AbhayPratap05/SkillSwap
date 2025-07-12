import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { getSwaps } from '../../features/admin/adminSlice';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  TextField,
  InputAdornment,
  Link,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';

const getStatusColor = (status: string) => {
  switch (status) {
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

const Swaps = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();
  const { swaps, isLoading, isError, message } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(getSwaps() as any);
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      setShowAlert(true);
    }
  }, [isError]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredSwaps = swaps.filter(
    (swap) =>
      swap.requestor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.skillOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
      swap.skillWanted.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedSwaps = filteredSwaps.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Swap Management
        </Typography>

        <Paper sx={{ mt: 4 }}>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search swaps by user name or skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Requestor</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Skills</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Feedback</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedSwaps.map((swap) => (
                  <TableRow key={swap._id}>
                    <TableCell>
                      <Link href={`/users/${swap.requestor._id}`} underline="hover">
                        {swap.requestor.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/users/${swap.recipient._id}`} underline="hover">
                        {swap.recipient.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Offered: {swap.skillOffered}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Wanted: {swap.skillWanted}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={swap.status}
                        color={getStatusColor(swap.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(swap.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {swap.status === 'accepted' && (
                        <Box>
                          {swap.feedback?.fromRequestor && (
                            <Typography variant="body2" color="text.secondary">
                              From requestor: {swap.feedback.fromRequestor.rating}/5
                            </Typography>
                          )}
                          {swap.feedback?.fromRecipient && (
                            <Typography variant="body2" color="text.secondary">
                              From recipient: {swap.feedback.fromRecipient.rating}/5
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredSwaps.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
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

export default Swaps; 