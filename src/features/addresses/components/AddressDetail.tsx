import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Paper, CircularProgress,
  Button, Chip, Divider, IconButton, Tooltip,
} from '@mui/material';
import { ArrowBack, ContentCopy } from '@mui/icons-material';
import { useAddressDetails } from '../hooks/useAddresses';

const CITY_LABELS: Record<string, string> = {
  dubai: 'Dubai',
  abu_dhabi: 'Abu Dhabi',
  sharjah: 'Sharjah',
};

export default function AddressDetail() {
  const { addressId } = useParams<{ addressId: string }>();
  const navigate = useNavigate();
  const { data: address, isLoading, error } = useAddressDetails(addressId!);

  if (isLoading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Failed to load address</Typography>;
  if (!address) return <Typography sx={{ p: 3 }}>Address not found</Typography>;

  const cityLabel = CITY_LABELS[address.cityId ?? ''] ?? address.cityId ?? '';

  const formattedAddress = [
    address.label,
    address.building,
    address.floor && address.apartment ? `Floor ${address.floor}, Apt ${address.apartment}` : address.floor ? `Floor ${address.floor}` : address.apartment ? `Apt ${address.apartment}` : null,
    address.area,
    cityLabel,
  ].filter(Boolean).join(' — ');

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedAddress);
  };

  const hasCoordinates = address.latitude !== undefined || address.longitude !== undefined;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/addresses')} sx={{ mb: 2 }}>
        Back to Addresses
      </Button>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4">Address Details</Typography>
        <Tooltip title="Copy address">
          <IconButton onClick={handleCopy} size="small">
            <ContentCopy fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Paper sx={{ p: 3, maxWidth: 600 }}>
        {/* IDs */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="ID" value={address.id} disabled fullWidth />
          <TextField label="Customer ID" value={address.customerId} disabled fullWidth />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Location */}
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Location
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Label" value={address.label || ''} fullWidth />
          <TextField label="Area" value={address.area || ''} fullWidth />
          <TextField label="Building" value={address.building || ''} fullWidth />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField label="Floor" value={address.floor || ''} fullWidth />
            <TextField label="Apartment" value={address.apartment || ''} fullWidth />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField label="City" value={cityLabel} disabled fullWidth />
            <Chip label={cityLabel || '—'} size="small" sx={{ bgcolor: 'grey.100', flexShrink: 0 }} />
          </Box>
        </Box>

        {/* Coordinates */}
        {hasCoordinates && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Coordinates
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField label="Latitude" value={address.latitude ?? ''} disabled fullWidth />
              <TextField label="Longitude" value={address.longitude ?? ''} disabled fullWidth />
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
