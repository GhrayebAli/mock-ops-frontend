import { Box, Typography, TextField, Chip } from '@mui/material';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUsers } from '../../users/hooks/useUsers';

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

      <Box>
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
