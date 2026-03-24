import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Switch, FormControlLabel, Paper, CircularProgress, Alert } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserDetails, USER_DETAILS_QUERY_KEY, USERS_QUERY_KEY } from '../hooks/useUsers';
import { UserAPI } from '../../../api/UserAPI';
import type { User } from '../../../interfaces/User';

export default function UserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: user, isLoading, error } = useUserDetails(userId!);

  const [form, setForm] = useState<Partial<User>>({});

  useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const { mutate: saveUser, isPending: isSaving, isSuccess, error: saveError } = useMutation({
    mutationFn: (data: Partial<User>) => UserAPI.updateUser(userId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_DETAILS_QUERY_KEY(userId!) });
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });

  if (isLoading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Failed to load user</Typography>;
  if (!user) return <Typography sx={{ p: 3 }}>User not found</Typography>;

  const handleChange = (field: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/users')} sx={{ mb: 2 }}>
        Back to Users
      </Button>
      <Typography variant="h4" sx={{ mb: 3 }}>User Details</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {isSuccess && <Alert severity="success">Saved successfully</Alert>}
          {saveError && <Alert severity="error">Failed to save changes</Alert>}
          <TextField label="ID" value={form.id ?? ''} disabled fullWidth />
          <TextField label="Email" value={form.email ?? ''} onChange={handleChange('email')} fullWidth />
          <TextField label="First Name" value={form.firstName ?? ''} onChange={handleChange('firstName')} fullWidth />
          <TextField label="Last Name" value={form.lastName ?? ''} onChange={handleChange('lastName')} fullWidth />
          <TextField label="Role" value={form.userRole ?? ''} onChange={handleChange('userRole')} fullWidth />
          <TextField label="Phone Number" value={form.phoneNumber ?? ''} onChange={handleChange('phoneNumber')} fullWidth />
          <FormControlLabel
            control={
              <Switch
                checked={form.isActive ?? false}
                onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
              />
            }
            label="Active"
          />
          <TextField
            label="Roles"
            value={form.roles?.join(', ') ?? ''}
            fullWidth
            disabled
          />
          <Button
            variant="contained"
            color="primary"
            loading={isSaving}
            onClick={() => saveUser(form)}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
