import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, TextField, Paper, CircularProgress,
  Button, Chip, Divider, IconButton, Tooltip, Stack, Card, CardContent,
} from '@mui/material';
import { ArrowBack, ContentCopy, MapPin, Home } from '@mui/icons-material';
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

  if (isLoading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" sx={{ fontWeight: 500 }}>
          Failed to load address
        </Typography>
      </Box>
    );
  }

  if (!address) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Address not found</Typography>
      </Box>
    );
  }

  const cityLabel = CITY_LABELS[address.cityId ?? ''] ?? address.cityId ?? '';

  const formattedAddress = [
    address.label,
    address.building,
    address.floor && address.apartment ? `Floor ${address.floor}, Apt ${address.apartment}` : address.floor ? `Floor ${address.floor}` : address.apartment ? `Apt ${address.apartment}` : null,
    address.area,
    cityLabel,
  ].filter(Boolean).join(' • ');

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedAddress);
  };

  const hasCoordinates = address.latitude !== undefined || address.longitude !== undefined;

  return (
    <Box sx={{ p: 3 }}>
      {/* Back Button */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/addresses')}
        sx={{ mb: 2, textTransform: 'none' }}
      >
        Back to Addresses
      </Button>

      {/* Header Card */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MapPin />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Address Details
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {address.building}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.95 }}>
                {address.area}
              </Typography>
            </Box>
            <Chip
              label={address.label || '—'}
              sx={{
                bgcolor: 'rgba(255,255,255,0.3)',
                color: 'white',
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.5)',
              }}
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Stack spacing={3}>
        {/* IDs Section */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
            Identifiers
          </Typography>
          <Stack spacing={2}>
            <TextField label="Address ID" value={address.id} disabled fullWidth size="small" />
            <TextField label="Customer ID" value={address.customerId} disabled fullWidth size="small" />
          </Stack>
        </Paper>

        {/* Location Details Section */}
        <Paper sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Home sx={{ fontSize: 20, color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Location Details
            </Typography>
          </Box>
          <Stack spacing={2}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Building Name" value={address.building || ''} disabled fullWidth size="small" />
              <TextField label="Area / District" value={address.area || ''} disabled fullWidth size="small" />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
              <TextField label="Floor" value={address.floor || '—'} disabled fullWidth size="small" />
              <TextField label="Apartment" value={address.apartment || '—'} disabled fullWidth size="small" />
              <TextField label="City" value={cityLabel} disabled fullWidth size="small" />
            </Box>
          </Stack>
        </Paper>

        {/* Full Address Preview */}
        <Paper sx={{ p: 2.5, bgcolor: 'action.hover', border: '1px dashed', borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                Full Address
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {formattedAddress}
              </Typography>
            </Box>
            <Tooltip title="Copy to clipboard">
              <IconButton onClick={handleCopy} size="small" sx={{ flexShrink: 0 }}>
                <ContentCopy fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Paper>

        {/* Coordinates Section */}
        {hasCoordinates && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
              Geo Coordinates
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Latitude"
                value={address.latitude ?? '—'}
                disabled
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Longitude"
                value={address.longitude ?? '—'}
                disabled
                fullWidth
                size="small"
                InputProps={{ readOnly: true }}
              />
            </Box>
            {address.latitude && address.longitude && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {address.latitude.toFixed(4)}, {address.longitude.toFixed(4)}
              </Typography>
            )}
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
