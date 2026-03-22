import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../app/authSlice';
import { setAuthToken } from '../api/client';
import { UserAPI } from '../api/UserAPI';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@washmen.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const { user, token } = await UserAPI.login(email, password);
      setAuthToken(token);
      dispatch(setCredentials({ user, token }));
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.details?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%' }}>
        <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>Washmen Ops</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth />
          <Button variant="contained" onClick={handleLogin} disabled={loading} fullWidth>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Mock auth — any email from seed data works
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
