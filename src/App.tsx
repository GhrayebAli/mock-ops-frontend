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
import OrdersList from './features/orders/components/OrdersList';
import OrderDetail from './features/orders/components/OrderDetail';
import LoginPage from './auth/LoginPage';

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    primary:    { main: '#261B7D', contrastText: '#ffffff' },
    success:    { main: '#05B8AB', contrastText: '#ffffff' },
    error:      { main: '#FE4D4D', contrastText: '#ffffff' },
    warning:    { main: '#FE4D4D', contrastText: '#ffffff' },
    background: { default: 'hsl(240, 20%, 97%)', paper: '#ffffff' },
    text:       { primary: '#261B7D', secondary: 'hsl(247, 20%, 46%)' },
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 9999, textTransform: 'none', fontWeight: 600 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 9999, fontWeight: 600 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#261B7D', boxShadow: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
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
        <Button color="inherit" component={Link} to="/orders">Orders</Button>
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
        <Route path="/orders" element={<RequireAuth><OrdersList /></RequireAuth>} />
        <Route path="/orders/:orderId" element={<RequireAuth><OrderDetail /></RequireAuth>} />
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
