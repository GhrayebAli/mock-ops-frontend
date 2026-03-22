import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Switch, FormControlLabel, Paper, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useUserDetails } from '../hooks/useUsers';

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { data: user, isLoading, error } = useUserDetails(userId!);

  if (isLoading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Failed to load user</Typography>;
  if (!user) return <Typography sx={{ p: 3 }}>User not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
        Back to Users
      </Button>
      <Typography variant="h4" sx={{ mb: 3 }}>User Details</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="ID" value={user.id} disabled fullWidth />
          <TextField label="Email" value={user.email} fullWidth />
          <TextField label="First Name" value={user.firstName} fullWidth />
          <TextField label="Last Name" value={user.lastName} fullWidth />
          <TextField label="Role" value={user.userRole} fullWidth />
          <FormControlLabel
            control={<Switch checked={user.isActive} />}
            label="Active"
          />
          <TextField
            label="Roles"
            value={user.roles?.join(', ')}
            fullWidth
            disabled
          />
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
