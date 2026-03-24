import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { store, RootState } from './app/store';
import { logout } from './app/authSlice';
import { clearAuthToken } from './api/client';
import { ThemeContextProvider, useTheme } from './context/ThemeContext';
import Dashboard from './features/dashboard/components/Dashboard';
import UsersList from './features/users/components/UsersList';
import UserDetail from './features/users/components/UserDetail';
import LoginPage from './auth/LoginPage';

const queryClient = new QueryClient();

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function NavBar() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useTheme();

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    clearAuthToken();
    dispatch(logout());
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 3 }}>Washmen Ops</Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/users">Users</Button>
        <Box sx={{ flexGrow: 1 }} />
        {user && <Typography variant="body2" sx={{ mr: 2 }}>{user.firstName} {user.lastName}</Typography>}
        <IconButton color="inherit" onClick={toggleTheme} title={isDarkMode ? 'Light mode' : 'Dark mode'}>
          {isDarkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        <Button color="inherit" onClick={handleLogout}>Logout</Button>
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

function AppWithTheme() {
  const { theme } = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <ThemeContextProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AppWithTheme />
        </QueryClientProvider>
      </Provider>
    </ThemeContextProvider>
  );
}
