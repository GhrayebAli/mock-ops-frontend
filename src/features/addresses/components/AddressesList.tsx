import { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAddresses, useCreateAddress } from '../hooks/useAddresses';
import type { Address } from '../../../interfaces/Address';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 140 },
  { field: 'customerId', headerName: 'Customer ID', width: 160 },
  { field: 'label', headerName: 'Label', width: 120 },
  { field: 'area', headerName: 'Area', width: 180 },
  { field: 'building', headerName: 'Building', width: 180 },
  { field: 'cityId', headerName: 'City', width: 120 },
];

const emptyForm: Omit<Address, 'id'> = {
  customerId: '',
  label: '',
  area: '',
  building: '',
  floor: '',
  apartment: '',
  cityId: '',
};

export default function AddressesList() {
  const navigate = useNavigate();
  const [customerFilter, setCustomerFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const { data: addresses, isLoading, error } = useAddresses(
    customerFilter ? { customerId: customerFilter } : undefined
  );
  const createAddress = useCreateAddress();

  const handleCreate = async () => {
    await createAddress.mutateAsync(form);
    setDialogOpen(false);
    setForm(emptyForm);
  };

  if (error) {
    return <Typography color="error" sx={{ p: 3 }}>Failed to load addresses: {(error as Error).message}</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Addresses</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setDialogOpen(true)}>
          New Address
        </Button>
      </Box>

      <TextField
        label="Filter by Customer ID"
        value={customerFilter}
        onChange={(e) => setCustomerFilter(e.target.value)}
        size="small"
        sx={{ mb: 2, width: 280 }}
      />

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={addresses || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          onRowClick={(params) => navigate(`/addresses/${params.row.id}`)}
          sx={{ cursor: 'pointer' }}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Address</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            {(['customerId', 'label', 'area', 'building', 'floor', 'apartment', 'cityId'] as const).map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={form[field] || ''}
                onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
                required={field === 'customerId'}
                fullWidth
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!form.customerId || createAddress.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
