import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Box, Divider } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './app/store';
import { logout } from './app/authSlice';
import { clearAuthToken } from './api/client';
import Dashboard from './features/dashboard/components/Dashboard';
import UsersList from './features/users/components/UsersList';
import UserDetail from './features/users/components/UserDetail';
import AddressesList from './features/addresses/components/AddressesList';
import AddressDetail from './features/addresses/components/AddressDetail';
import LoginPage from './auth/LoginPage';

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function NavBar() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    clearAuthToken();
    dispatch(logout());
  };

  const location = useLocation();

  const navLinks = [
    { label: 'Dashboard', to: '/' },
    { label: 'Users', to: '/users' },
    { label: 'Addresses', to: '/addresses' },
  ];

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  const initials = user ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() : '';

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <Toolbar sx={{ gap: 0, minHeight: '56px !important', px: '24px !important' }}>
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mr: 4 }}>
          <Box sx={{
            width: 28, height: 28, borderRadius: '7px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: 'white', letterSpacing: -0.5,
          }}>W</Box>
          <Typography sx={{ fontWeight: 700, fontSize: 15, color: 'white', letterSpacing: -0.3 }}>
            Washmen <Box component="span" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>Ops</Box>
          </Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1.5, mr: 3 }} />

        {/* Nav links */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {navLinks.map(({ label, to }) => (
            <Box
              key={to}
              component={Link}
              to={to}
              sx={{
                px: 1.5, py: 0.6, borderRadius: '6px',
                fontSize: 13.5, fontWeight: isActive(to) ? 600 : 400,
                color: isActive(to) ? 'white' : 'rgba(255,255,255,0.5)',
                bgcolor: isActive(to) ? 'rgba(255,255,255,0.08)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
                '&:hover': { color: 'white', bgcolor: 'rgba(255,255,255,0.06)' },
              }}
            >
              {label}
            </Box>
          ))}
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* User + logout */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 28, height: 28, borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)',
              }}>{initials}</Box>
              <Typography sx={{ fontSize: 13.5, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                {user.firstName} {user.lastName}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1.5 }} />
            <Box
              component="span"
              onClick={handleLogout}
              sx={{ fontSize: 13.5, color: 'rgba(255,255,255,0.45)', cursor: 'pointer', '&:hover': { color: 'rgba(255,255,255,0.8)' }, transition: 'color 0.15s' }}
            >
              Sign out
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

function AppRoutes() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/users" element={<RequireAuth><UsersList /></RequireAuth>} />
        <Route path="/users/:userId" element={<RequireAuth><UserDetail /></RequireAuth>} />
        <Route path="/addresses" element={<RequireAuth><AddressesList /></RequireAuth>} />
        <Route path="/addresses/:addressId" element={<RequireAuth><AddressDetail /></RequireAuth>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
