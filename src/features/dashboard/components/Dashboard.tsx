import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import { People, ShoppingCart, LocationOn, CheckCircle } from '@mui/icons-material';
import { useUsers } from '../../users/hooks/useUsers';
import { useAddresses } from '../../addresses/hooks/useAddresses';

function MetricCard({ title, value, icon, color }: { title: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <Card sx={{ minWidth: 200 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="text.secondary" variant="body2">{title}</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>{value}</Typography>
          </Box>
          <Box sx={{ color, fontSize: 40 }}>{icon}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data: users } = useUsers();
  const { data: addresses } = useAddresses();
  const activeUsers = users?.filter(u => u.isActive).length || 0;
  const totalUsers = users?.length || 0;
  const totalAddresses = addresses?.length || 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Total Users" value={totalUsers} icon={<People fontSize="inherit" />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Active Users" value={activeUsers} icon={<CheckCircle fontSize="inherit" />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Orders Today" value={5} icon={<ShoppingCart fontSize="inherit" />} color="#ed6c02" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Addresses" value={totalAddresses} icon={<LocationOn fontSize="inherit" />} color="#9c27b0" />
        </Grid>
      </Grid>
    </Box>
  );
}
