import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Chip, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'email', headerName: 'Email', width: 220 },
  { field: 'firstName', headerName: 'First Name', width: 140 },
  { field: 'lastName', headerName: 'Last Name', width: 140 },
  { field: 'userRole', headerName: 'Role', width: 140 },
  { field: 'phoneNumber', headerName: 'Phone', width: 160 },
  {
    field: 'isActive',
    headerName: 'Status',
    width: 120,
    renderCell: (params) => (
      <Chip
        label={params.value ? 'Active' : 'Inactive'}
        color={params.value ? 'success' : 'default'}
        size="small"
      />
    ),
  },
  {
    field: 'roles',
    headerName: 'Roles',
    width: 200,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {(params.value as string[])?.map((role: string) => (
          <Chip key={role} label={role} size="small" variant="outlined" />
        ))}
      </Box>
    ),
  },
];

export default function UsersList() {
  const { data: users, isLoading, error } = useUsers();
  const navigate = useNavigate();

  if (error) {
    return <Typography color="error">Failed to load users: {(error as Error).message}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Users</Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          onRowClick={(params) => navigate(`/users/${params.row.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );
}
