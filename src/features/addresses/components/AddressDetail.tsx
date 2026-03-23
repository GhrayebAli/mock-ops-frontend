import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Paper, CircularProgress, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useAddressDetails } from '../hooks/useAddresses';

export default function AddressDetail() {
  const { addressId } = useParams<{ addressId: string }>();
  const navigate = useNavigate();
  const { data: address, isLoading, error } = useAddressDetails(addressId!);

  if (isLoading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Failed to load address</Typography>;
  if (!address) return <Typography sx={{ p: 3 }}>Address not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/addresses')} sx={{ mb: 2 }}>
        Back to Addresses
      </Button>
      <Typography variant="h4" sx={{ mb: 3 }}>Address Details</Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="ID" value={address.id} disabled fullWidth />
          <TextField label="Customer ID" value={address.customerId} disabled fullWidth />
          <TextField label="Label" value={address.label || ''} fullWidth />
          <TextField label="Area" value={address.area || ''} fullWidth />
          <TextField label="Building" value={address.building || ''} fullWidth />
          <TextField label="Floor" value={address.floor || ''} fullWidth />
          <TextField label="Apartment" value={address.apartment || ''} fullWidth />
          <TextField label="City ID" value={address.cityId || ''} fullWidth />
          {address.latitude !== undefined && (
            <TextField label="Latitude" value={address.latitude} disabled fullWidth />
          )}
          {address.longitude !== undefined && (
            <TextField label="Longitude" value={address.longitude} disabled fullWidth />
          )}
        </Box>
      </Paper>
    </Box>
  );
}
