import { Box, Card, CardContent, Typography, Grid, TextField, Chip } from '@mui/material';
import { People, CheckCircle, PersonOff, AdminPanelSettings, Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUsers } from '../../users/hooks/useUsers';

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

const columns: GridColDef[] = [
  { field: 'firstName', headerName: 'First Name', flex: 1 },
  { field: 'lastName', headerName: 'Last Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 2 },
  { field: 'phoneNumber', headerName: 'Phone', flex: 1, valueFormatter: (v) => v ?? '—' },
  { field: 'userRole', headerName: 'Role', flex: 1 },
  { field: 'employeeId', headerName: 'Employee ID', flex: 1, valueFormatter: (v) => v ?? '—' },
  {
    field: 'isActive',
    headerName: 'Status',
    flex: 1,
    renderCell: ({ value }) => (
      <Chip label={value ? 'Active' : 'Inactive'} color={value ? 'success' : 'default'} size="small" />
    ),
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const { data: users } = useUsers();

  const totalUsers = users?.length ?? 0;
  const activeUsers = users?.filter(u => u.isActive).length ?? 0;
  const inactiveUsers = users?.filter(u => !u.isActive).length ?? 0;
  const adminUsers = users?.filter(u => u.userRole === 'admin').length ?? 0;

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
      <Typography variant="h4" sx={{ mb: 3 }}>Customers</Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Total Customers" value={totalUsers} icon={<People fontSize="inherit" />} color="#1976d2" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Active" value={activeUsers} icon={<CheckCircle fontSize="inherit" />} color="#2e7d32" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Inactive" value={inactiveUsers} icon={<PersonOff fontSize="inherit" />} color="#d32f2f" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard title="Admins" value={adminUsers} icon={<AdminPanelSettings fontSize="inherit" />} color="#7b1fa2" />
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">All Customers</Typography>
          <TextField
            size="small"
            placeholder="Search by name, email, role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            slotProps={{ input: { startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> } }}
            sx={{ width: 300 }}
          />
        </Box>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
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
