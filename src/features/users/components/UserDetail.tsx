import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Chip, Paper, CircularProgress, Divider } from '@mui/material';
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
    <Box sx={{ p: 3, maxWidth: 700 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3, color: 'text.secondary' }}
      >
        Back
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4">{user.firstName} {user.lastName}</Typography>
        <Chip
          label={user.isActive ? 'Active' : 'Inactive'}
          color={user.isActive ? 'success' : 'default'}
          size="small"
        />
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'hsl(245, 20%, 88%)', borderRadius: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            Account Info
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="ID" value={user.id} disabled fullWidth size="small" />
            <TextField label="Email" value={user.email} fullWidth size="small" />
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'hsl(245, 20%, 88%)' }} />

        <Box sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            Personal Info
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextField label="First Name" value={user.firstName} fullWidth size="small" />
            <TextField label="Last Name" value={user.lastName} fullWidth size="small" />
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'hsl(245, 20%, 88%)' }} />

        <Box sx={{ p: 3 }}>
          <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1 }}>
            Role & Permissions
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Role" value={user.userRole} fullWidth size="small" />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {user.roles?.map(r => (
                <Chip key={r} label={r} size="small" variant="outlined" color="primary" />
              ))}
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'hsl(245, 20%, 88%)' }} />

        <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
