import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
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

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 0, mr: 3 }}>Washmen Ops</Typography>
        <Button color="inherit" component={Link} to="/">Dashboard</Button>
        <Button color="inherit" component={Link} to="/users">Users</Button>
        <Button color="inherit" component={Link} to="/addresses">Addresses</Button>
        <Box sx={{ flexGrow: 1 }} />
        {user && <Typography variant="body2" sx={{ mr: 2 }}>{user.firstName} {user.lastName}</Typography>}
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
