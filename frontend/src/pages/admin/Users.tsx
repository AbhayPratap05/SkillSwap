import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/store';
import { getUsers, banUser, unbanUser } from '../../features/admin/adminSlice';
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
  IconButton,
  Avatar,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SearchIcon from '@mui/icons-material/Search';
import LoadingSpinner from '../../components/LoadingSpinner';
import Alert from '../../components/Alert';
import ConfirmDialog from '../../components/ConfirmDialog';

const Users = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'ban' | 'unban'>('ban');

  const dispatch = useDispatch();
  const { users, isLoading, isError, message } = useSelector(
    (state: RootState) => state.admin
  );

  useEffect(() => {
    dispatch(getUsers() as any);
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      setAlertMessage(message);
      setAlertSeverity('error');
      setShowAlert(true);
    }
  }, [isError, message]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBanUser = () => {
    if (!selectedUser) return;

    dispatch(banUser(selectedUser) as any)
      .unwrap()
      .then(() => {
        setAlertMessage('User banned successfully');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch(() => {
        setAlertMessage('Failed to ban user');
        setAlertSeverity('error');
        setShowAlert(true);
      });

    setShowConfirmDialog(false);
    setSelectedUser(null);
  };

  const handleUnbanUser = () => {
    if (!selectedUser) return;

    dispatch(unbanUser(selectedUser) as any)
      .unwrap()
      .then(() => {
        setAlertMessage('User unbanned successfully');
        setAlertSeverity('success');
        setShowAlert(true);
      })
      .catch(() => {
        setAlertMessage('Failed to unban user');
        setAlertSeverity('error');
        setShowAlert(true);
      });

    setShowConfirmDialog(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
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
          User Management
        </Typography>

        <Paper sx={{ mt: 4 }}>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search users by name or email"
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
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar alt={user.name}>
                          {user.name[0]}
                        </Avatar>
                        <Box>
                          <Typography>{user.name}</Typography>
                          {user.isAdmin && (
                            <Chip
                              label="Admin"
                              size="small"
                              color="primary"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isBanned ? 'Banned' : 'Active'}
                        color={user.isBanned ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {!user.isAdmin && (
                        <IconButton
                          color={user.isBanned ? 'success' : 'error'}
                          onClick={() => {
                            setSelectedUser(user._id);
                            setConfirmAction(user.isBanned ? 'unban' : 'ban');
                            setShowConfirmDialog(true);
                          }}
                        >
                          {user.isBanned ? <CheckCircleIcon /> : <BlockIcon />}
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredUsers.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>

      <ConfirmDialog
        open={showConfirmDialog}
        title={`${confirmAction === 'ban' ? 'Ban' : 'Unban'} User`}
        message={`Are you sure you want to ${
          confirmAction === 'ban' ? 'ban' : 'unban'
        } this user?`}
        confirmText={confirmAction === 'ban' ? 'Ban' : 'Unban'}
        onConfirm={confirmAction === 'ban' ? handleBanUser : handleUnbanUser}
        onCancel={() => {
          setShowConfirmDialog(false);
          setSelectedUser(null);
        }}
        severity={confirmAction === 'ban' ? 'error' : 'warning'}
      />

      <Alert
        open={showAlert}
        message={alertMessage}
        severity={alertSeverity}
        onClose={() => setShowAlert(false)}
      />
    </Container>
  );
};

export default Users; 