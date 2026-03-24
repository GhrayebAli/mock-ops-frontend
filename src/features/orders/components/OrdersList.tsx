import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Chip, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { STATUS_COLORS, PRIORITY_COLORS } from '../constants';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 120 },
  { field: 'customerAlphaId', headerName: 'Customer', width: 140 },
  {
    field: 'status',
    headerName: 'Status',
    width: 140,
    renderCell: (params) => (
      <Chip
        label={params.value}
        color={STATUS_COLORS[params.value] ?? 'default'}
        size="small"
      />
    ),
  },
  { field: 'orderType', headerName: 'Type', width: 110 },
  { field: 'cityId', headerName: 'City', width: 120 },
  {
    field: 'priority',
    headerName: 'Priority',
    width: 110,
    renderCell: (params) => (
      <Chip
        label={params.value ?? 'normal'}
        color={PRIORITY_COLORS[params.value] ?? 'default'}
        size="small"
      />
    ),
  },
  {
    field: 'createdAt',
    headerName: 'Created',
    width: 180,
    valueFormatter: (value) => value ? new Date(value).toLocaleString() : '—',
  },
];

export default function OrdersList() {
  const { data: orders, isLoading, error } = useOrders();
  const navigate = useNavigate();

  if (error) {
    return <Typography color="error">Failed to load orders: {(error as Error).message}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>Orders</Typography>
      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={orders || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          onRowClick={(params) => navigate(`/orders/${params.row.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>
    </Box>
  );
}
