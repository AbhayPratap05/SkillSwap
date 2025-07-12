import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#F4F5F7' }}>
      <Navbar />
      <Container component="main" maxWidth={false} disableGutters sx={{ flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainLayout; 