import { Box, Card, CardContent, Typography, Grid, TextField, Chip } from '@mui/material';
import { People, ShoppingCart, LocationOn, CheckCircle, Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUsers } from '../../users/hooks/useUsers';
import { useOrders } from '../../orders/hooks/useOrders';
import { useAddresses } from '../../addresses/hooks/useAddresses';

function MetricCard({ title, value, icon, color, onClick }: { title: string; value: string | number; icon: React.ReactNode; color: string; onClick?: () => void }) {
  return (
    <Card sx={{ minWidth: 200, cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
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

const userColumns: GridColDef[] = [
  { field: 'firstName', headerName: 'First Name', flex: 1 },
  { field: 'lastName', headerName: 'Last Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 2 },
  { field: 'phoneNumber', headerName: 'Phone', flex: 1, valueFormatter: (v) => v ?? '—' },
  { field: 'userRole', headerName: 'Role', flex: 1 },
  {
    field: 'isActive',
    headerName: 'Status',
    flex: 1,
    renderCell: ({ value }) => (
      <Chip label={value ? 'Active' : 'Inactive'} color={value ? 'success' : 'default'} size="small" />
    ),
  },
  { field: 'employeeId', headerName: 'Employee ID', flex: 1, valueFormatter: (v) => v ?? '—' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: users } = useUsers();
  const { data: orders } = useOrders();
  const { data: addresses } = useAddresses();

  const totalUsers = users?.length ?? '—';
  const activeUsers = users?.filter(u => u.isActive).length ?? '—';
  const totalOrders = orders?.length ?? '—';
  const totalAddresses = addresses?.length ?? '—';

  const filteredUsers = (users ?? []).filter(u => {
    const q = search.toLowerCase();
    return (
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phoneNumber?.toLowerCase().includes(q) ||
      u.userRole?.toLowerCase().includes(q) ||
      u.employeeId?.toLowerCase().includes(q)
    );
  });

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
          <MetricCard title="Orders" value={totalOrders} icon={<ShoppingCart fontSize="inherit" />} color="#ed6c02" onClick={() => navigate('/orders')} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Addresses" value={totalAddresses} icon={<LocationOn fontSize="inherit" />} color="#9c27b0" />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Users</Typography>
          <TextField
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> } }}
            sx={{ width: 280 }}
          />
        </Box>
        <DataGrid
          rows={filteredUsers}
          columns={userColumns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          onRowClick={({ row }) => navigate(`/users/${row.id}`)}
          sx={{ cursor: 'pointer' }}
          autoHeight
        />
      </Box>
    </Box>
  );
}
