import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ThemeProvider, createTheme, CssBaseline,
  AppBar, Toolbar, Typography, Button, Box, Avatar,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './app/store';
import { logout } from './app/authSlice';
import { clearAuthToken } from './api/client';
import Dashboard from './features/dashboard/components/Dashboard';
import UsersList from './features/users/components/UsersList';
import UserDetail from './features/users/components/UserDetail';
import LoginPage from './auth/LoginPage';

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    primary: { main: '#1565c0' },
    background: { default: '#f4f6f9', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.07)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { boxShadow: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500 },
      },
    },
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
  const location = useLocation();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    clearAuthToken();
    dispatch(logout());
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : '';

  const navLinks = [
    { label: 'Dashboard', to: '/' },
    { label: 'Users', to: '/users' },
  ];

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: 'white', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
    >
      <Toolbar sx={{ gap: 0.5 }}>
        <Typography
          variant="h6"
          sx={{ flexGrow: 0, mr: 3, color: 'primary.main', fontWeight: 800, letterSpacing: -0.5 }}
        >
          Washmen Ops
        </Typography>

        {navLinks.map(({ label, to }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Button
              key={to}
              component={Link}
              to={to}
              sx={{
                color: active ? 'primary.main' : 'text.secondary',
                fontWeight: active ? 700 : 400,
                px: 1.5,
                borderRadius: 2,
                bgcolor: active ? 'primary.50' : 'transparent',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              {label}
            </Button>
          );
        })}

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mr: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 12, fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
              {user.firstName} {user.lastName}
            </Typography>
          </Box>
        )}

        <Button variant="outlined" size="small" onClick={handleLogout} sx={{ ml: 0.5 }}>
          Logout
        </Button>
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
