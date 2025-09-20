'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/slices/authSlice';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Badge,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  ExitToApp,
  Dashboard,
  Person,
  Business,
  Notifications,
  Search,
  Home,
} from '@mui/icons-material';
import Link from 'next/link';

export function AdryHeader() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'EMPLOYEE':
        return '/employee/dashboard';
      case 'EMPLOYER':
        return '/employer/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  const getProfileLink = () => {
    if (!user) return '/profile';
    switch (user.role) {
      case 'EMPLOYEE':
        return '/employee/profile';
      case 'EMPLOYER':
        return '/employer/profile';
      case 'ADMIN':
        return '/admin/profile';
      default:
        return '/profile';
    }
  };

  const getRoleLabel = () => {
    if (!user) return '';
    switch (user.role) {
      case 'EMPLOYEE':
        return 'Housekeeper';
      case 'EMPLOYER':
        return 'Employer';
      case 'ADMIN':
        return 'Admin';
      default:
        return '';
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h5"
          component={Link}
          href="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'primary.main',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Home sx={{ fontSize: 28 }} />
          Adry
        </Typography>

        {isAuthenticated ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Search Button */}
            <IconButton
              component={Link}
              href="/search"
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              <Search />
            </IconButton>

            {/* Notifications */}
            <IconButton
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              <Badge badgeContent={3} color="secondary">
                <Notifications />
              </Badge>
            </IconButton>

            {/* Dashboard Link */}
            <Button
              component={Link}
              href={getDashboardLink()}
              startIcon={<Dashboard />}
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              Dashboard
            </Button>
            
            {/* User Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={getRoleLabel()}
                size="small"
                color="primary"
                variant="outlined"
              />
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                  {user?.email?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={() => { router.push(getProfileLink()); handleMenuClose(); }}>
                <Person sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={() => { router.push('/settings'); handleMenuClose(); }}>
                <AccountCircle sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              href="/search"
              color="inherit"
              startIcon={<Search />}
              sx={{ color: 'text.primary' }}
            >
              Browse
            </Button>
            <Button
              component={Link}
              href="/login"
              color="inherit"
              sx={{ color: 'text.primary' }}
            >
              Login
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              color="primary"
            >
              Sign Up
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
