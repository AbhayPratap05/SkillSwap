import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../app/store';
import { logout } from '../features/auth/authSlice';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Slide,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function HideOnScroll(props: any) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = (props: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavClick = (to: string) => {
    navigate(to);
    handleCloseNavMenu();
    handleCloseUserMenu();
  };

  const onLogout = () => {
    dispatch(logout() as any);
    navigate('/');
    handleCloseUserMenu();
  };

  return (
    <HideOnScroll {...props}>
      <AppBar position="sticky" elevation={4} sx={{ background: '#181A1B', color: 'white', boxShadow: '0 2px 12px #0003' }}>
        <Container maxWidth={false} disableGutters sx={{ px: { xs: 2, md: 6 } }}>
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            {/* Logo and Brand */}
            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2, cursor: 'pointer' }} onClick={() => handleNavClick('/')}> 
              <AutoAwesomeIcon sx={{ fontSize: 32, color: 'white', mr: 1, transition: 'transform 0.2s', '&:hover': { transform: 'rotate(20deg) scale(1.1)' } }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  letterSpacing: 1,
                  textShadow: '0 2px 8px #0002',
                  textDecoration: 'none',
                  fontSize: { xs: '1.2rem', md: '1.5rem' },
                  transition: 'color 0.2s',
                  '&:hover': { color: '#fffde4' },
                }}
              >
                SkillSwap
              </Typography>
            </Box>

            {/* Hamburger for mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="open navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
                sx={{ transition: 'transform 0.2s', '&:active': { transform: 'scale(1.1)' } }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                <MenuItem onClick={() => handleNavClick('/')}>Home</MenuItem>
                {user && <MenuItem onClick={() => handleNavClick('/swaps')}>My Swaps</MenuItem>}
                {user && <MenuItem onClick={() => handleNavClick('/profile')}>Profile</MenuItem>}
                {user?.isAdmin && <MenuItem onClick={() => handleNavClick('/admin')}>Admin</MenuItem>}
                {user ? (
                  <MenuItem onClick={onLogout}>Logout</MenuItem>
                ) : (
                  <>
                    <MenuItem onClick={() => handleNavClick('/login')}>Login</MenuItem>
                    <MenuItem onClick={() => handleNavClick('/register')}>Register</MenuItem>
                  </>
                )}
              </Menu>
            </Box>

            {/* Desktop navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, gap: 2, ml: 4 }}>
              <Button onClick={() => handleNavClick('/')} sx={{ color: 'white', fontWeight: 600, letterSpacing: 1, px: 2, borderRadius: 2, transition: 'background 0.2s', '&:hover': { background: '#23272A' } }}>Home</Button>
              {user && <Button onClick={() => handleNavClick('/swaps')} sx={{ color: 'white', fontWeight: 600, px: 2, borderRadius: 2, transition: 'background 0.2s', '&:hover': { background: '#23272A' } }}>My Swaps</Button>}
              {user && <Button onClick={() => handleNavClick('/profile')} sx={{ color: 'white', fontWeight: 600, px: 2, borderRadius: 2, transition: 'background 0.2s', '&:hover': { background: '#23272A' } }}>Profile</Button>}
              {user?.isAdmin && <Button onClick={() => handleNavClick('/admin')} sx={{ color: 'white', fontWeight: 600, px: 2, borderRadius: 2, transition: 'background 0.2s', '&:hover': { background: '#23272A' } }}>Admin</Button>}
            </Box>

            {/* User Avatar and Auth Buttons */}
            <Box sx={{ flexGrow: 0, ml: 2 }}>
              {user ? (
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, transition: 'box-shadow 0.2s', boxShadow: '0 2px 8px #0001', '&:hover': { boxShadow: '0 4px 16px #0002' } }}>
                    <Avatar alt={user.name} src={user.profilePhoto} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button color="inherit" onClick={() => handleNavClick('/login')} sx={{ fontWeight: 600 }}>Login</Button>
                  <Button color="inherit" onClick={() => handleNavClick('/register')} sx={{ fontWeight: 600 }}>Register</Button>
                </Box>
              )}
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => { handleNavClick('/profile'); }}>Profile</MenuItem>
                <MenuItem onClick={onLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar; 