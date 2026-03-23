import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, MenuItem, Select,
  FormControl, InputLabel, SelectChangeEvent,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAddresses, useCreateAddress } from '../hooks/useAddresses';
import type { Address } from '../../../interfaces/Address';

const CITY_LABELS: Record<string, string> = {
  dubai: 'Dubai',
  abu_dhabi: 'Abu Dhabi',
  sharjah: 'Sharjah',
};

const LABEL_COLORS: Record<string, 'primary' | 'warning' | 'success' | 'default'> = {
  Home: 'primary',
  Work: 'warning',
  Office: 'success',
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'customerId', headerName: 'Customer', flex: 1 },
  {
    field: 'label',
    headerName: 'Label',
    flex: 0.8,
    renderCell: (params) => (
      <Chip
        label={params.value || '—'}
        color={LABEL_COLORS[params.value] ?? 'default'}
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    field: 'area',
    headerName: 'Address',
    flex: 2,
    renderCell: (params) => {
      const row = params.row as Address;
      return (
        <Box sx={{ lineHeight: 1.3 }}>
          <Typography variant="body2">{row.building}</Typography>
          <Typography variant="caption" color="text.secondary">{row.area}</Typography>
        </Box>
      );
    },
  },
  {
    field: 'cityId',
    headerName: 'City',
    flex: 1,
    renderCell: (params) => (
      <Chip
        label={CITY_LABELS[params.value] ?? params.value}
        size="small"
        sx={{ bgcolor: 'grey.100' }}
      />
    ),
  },
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
  const [customerInput, setCustomerInput] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setCustomerFilter(customerInput), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [customerInput]);

  const params = (customerFilter || cityFilter)
    ? { ...(customerFilter && { customerId: customerFilter }), ...(cityFilter && { cityId: cityFilter }) }
    : undefined;

  const { data: addresses, isLoading, error } = useAddresses(params);
  const createAddress = useCreateAddress();

  const handleCreate = async () => {
    setSubmitAttempted(true);
    if (!form.customerId) return;
    await createAddress.mutateAsync(form);
    setDialogOpen(false);
    setForm(emptyForm);
    setSubmitAttempted(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setForm(emptyForm);
    setSubmitAttempted(false);
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

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filter by Customer ID"
          value={customerInput}
          onChange={(e) => setCustomerInput(e.target.value)}
          size="small"
          sx={{ width: 240 }}
        />
        <FormControl size="small" sx={{ width: 160 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={cityFilter}
            label="City"
            onChange={(e: SelectChangeEvent) => setCityFilter(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="dubai">Dubai</MenuItem>
            <MenuItem value="abu_dhabi">Abu Dhabi</MenuItem>
            <MenuItem value="sharjah">Sharjah</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
          rowHeight={52}
        />
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Address</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Customer ID"
              value={form.customerId}
              onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
              required
              fullWidth
              error={submitAttempted && !form.customerId}
              helperText={submitAttempted && !form.customerId ? 'Customer ID is required' : ''}
            />
            <TextField
              label="Label"
              value={form.label || ''}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              fullWidth
              placeholder="e.g. Home, Work, Office"
            />
            <TextField
              label="Area"
              value={form.area || ''}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              fullWidth
            />
            <TextField
              label="Building"
              value={form.building || ''}
              onChange={(e) => setForm((f) => ({ ...f, building: e.target.value }))}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Floor"
                value={form.floor || ''}
                onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Apartment"
                value={form.apartment || ''}
                onChange={(e) => setForm((f) => ({ ...f, apartment: e.target.value }))}
                fullWidth
              />
            </Box>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={form.cityId || ''}
                label="City"
                onChange={(e: SelectChangeEvent) => setForm((f) => ({ ...f, cityId: e.target.value }))}
              >
                <MenuItem value="dubai">Dubai</MenuItem>
                <MenuItem value="abu_dhabi">Abu Dhabi</MenuItem>
                <MenuItem value="sharjah">Sharjah</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createAddress.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
