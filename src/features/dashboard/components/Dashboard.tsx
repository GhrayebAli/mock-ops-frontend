import { Box, Card, CardContent, Typography, Grid, Divider } from '@mui/material';
import {
  People,
  Inventory2,
  Home,
  PersonCheck,
  Schedule,
  Autorenew,
  CheckCircle,
  Close,
} from '@mui/icons-material';
import { useUsers } from '../../users/hooks/useUsers';
import { useOrders } from '../../orders/hooks/useOrders';
import { useAddresses } from '../../addresses/hooks/useAddresses';

function MetricCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card sx={{
      minWidth: 200,
      cursor: 'default',
      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
        boxShadow: 6,
      },
    }}>
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
  const { data: orders } = useOrders();
  const { data: addresses } = useAddresses();

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter(u => u.isActive).length ?? 0;
  const totalOrders = orders?.length ?? 0;
  const totalAddresses = addresses?.length ?? 0;

  const pending = orders?.filter(o => o.status === 'pending').length ?? 0;
  const inProgress = orders?.filter(o => o.status === 'in_progress').length ?? 0;
  const delivered = orders?.filter(o => o.status === 'delivered').length ?? 0;
  const cancelled = orders?.filter(o => o.status === 'cancelled').length ?? 0;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Dashboard</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Total Users" value={totalUsers} icon={<People fontSize="inherit" />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Active Users" value={activeUsers} icon={<PersonCheck fontSize="inherit" />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Total Orders" value={totalOrders} icon={<Inventory2 fontSize="inherit" />} color="#ed6c02" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Addresses" value={totalAddresses} icon={<Home fontSize="inherit" />} color="#9c27b0" />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" sx={{ mb: 2 }} color="text.secondary">Orders by Status</Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Pending" value={pending} icon={<Schedule fontSize="inherit" />} color="#ed6c02" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="In Progress" value={inProgress} icon={<Autorenew fontSize="inherit" />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Delivered" value={delivered} icon={<CheckCircle fontSize="inherit" />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Cancelled" value={cancelled} icon={<Close fontSize="inherit" />} color="#d32f2f" />
        </Grid>
      </Grid>
    </Box>
  );
}
