import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, MenuItem, Select,
  FormControl, InputLabel, SelectChangeEvent, InputAdornment, Divider,
  Paper, Stack,
} from '@mui/material';
import { Add, Search, FilterAlt, MapPin } from '@mui/icons-material';
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
  { field: 'customerId', headerName: 'Customer', flex: 0.9 },
  {
    field: 'label',
    headerName: 'Type',
    flex: 0.7,
    renderCell: (params) => (
      <Chip
        label={params.value || '—'}
        color={LABEL_COLORS[params.value] ?? 'default'}
        size="small"
        variant="filled"
      />
    ),
  },
  {
    field: 'area',
    headerName: 'Location',
    flex: 2.5,
    renderCell: (params) => {
      const row = params.row as Address;
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MapPin sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {row.building}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {row.area}
            </Typography>
          </Box>
        </Box>
      );
    },
  },
  {
    field: 'cityId',
    headerName: 'City',
    flex: 0.8,
    renderCell: (params) => (
      <Chip
        label={CITY_LABELS[params.value] ?? params.value}
        size="small"
        variant="outlined"
        sx={{ fontWeight: 500 }}
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
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" sx={{ fontWeight: 500 }}>
          Failed to load addresses: {(error as Error).message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Addresses
          </Typography>
          {addresses && (
            <Typography variant="body2" color="text.secondary">
              {addresses.length} {addresses.length === 1 ? 'address' : 'addresses'}
              {(customerFilter || cityFilter) && ` • ${addresses.length === 0 ? 'no matches' : 'matching filters'}`}
            </Typography>
          )}
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          New Address
        </Button>
      </Box>

      {/* Filter Bar */}
      <Paper
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
          p: 2,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <FilterAlt fontSize="small" sx={{ color: 'text.secondary', flexShrink: 0 }} />
        <TextField
          placeholder="Search by customer"
          value={customerInput}
          onChange={(e) => setCustomerInput(e.target.value)}
          size="small"
          variant="outlined"
          sx={{
            width: 220,
            '& .MuiOutlinedInput-root': { fontSize: '0.875rem' },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ fontSize: 18, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />
        <Divider orientation="vertical" flexItem />
        <FormControl size="small" sx={{ width: 140 }}>
          <InputLabel>City</InputLabel>
          <Select
            value={cityFilter}
            label="City"
            onChange={(e: SelectChangeEvent) => setCityFilter(e.target.value)}
          >
            <MenuItem value="">All cities</MenuItem>
            <MenuItem value="dubai">Dubai</MenuItem>
            <MenuItem value="abu_dhabi">Abu Dhabi</MenuItem>
            <MenuItem value="sharjah">Sharjah</MenuItem>
          </Select>
        </FormControl>
        {(customerInput || cityFilter) && (
          <Button
            size="small"
            onClick={() => {
              setCustomerInput('');
              setCityFilter('');
            }}
            sx={{ ml: 'auto', textTransform: 'none' }}
          >
            Clear filters
          </Button>
        )}
      </Paper>

      {/* Data Grid */}
      <Paper sx={{ height: 600, width: '100%', overflow: 'hidden' }}>
        <DataGrid
          rows={addresses || []}
          columns={columns}
          loading={isLoading}
          pageSizeOptions={[10, 25, 50]}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          onRowClick={(params) => navigate(`/addresses/${params.row.id}`)}
          sx={{
            cursor: 'pointer',
            '& .MuiDataGrid-row': {
              '&:hover': { bgcolor: 'action.hover' },
            },
            '& .MuiDataGrid-cell': { borderBottomColor: 'divider' },
          }}
          rowHeight={56}
        />
      </Paper>

      {/* New Address Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>Add New Address</DialogTitle>
        <Divider />
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 2 }}>
            <TextField
              label="Customer ID"
              value={form.customerId}
              onChange={(e) => setForm((f) => ({ ...f, customerId: e.target.value }))}
              required
              fullWidth
              error={submitAttempted && !form.customerId}
              helperText={submitAttempted && !form.customerId ? 'Customer ID is required' : ''}
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Label"
                value={form.label || ''}
                onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
                placeholder="e.g. Home"
              />
              <FormControl>
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
            <TextField
              label="Building Name"
              value={form.building || ''}
              onChange={(e) => setForm((f) => ({ ...f, building: e.target.value }))}
              fullWidth
              placeholder="e.g. Marina Crown"
            />
            <TextField
              label="Area"
              value={form.area || ''}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              fullWidth
              placeholder="e.g. Dubai Marina"
            />
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField
                label="Floor"
                value={form.floor || ''}
                onChange={(e) => setForm((f) => ({ ...f, floor: e.target.value }))}
                placeholder="e.g. 18"
              />
              <TextField
                label="Apartment"
                value={form.apartment || ''}
                onChange={(e) => setForm((f) => ({ ...f, apartment: e.target.value }))}
                placeholder="e.g. 1803"
              />
            </Box>
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleDialogClose} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={createAddress.isPending}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Add Address
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
