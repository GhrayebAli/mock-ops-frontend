import { useState, useEffect, useRef } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {
  Box, Typography, TextField, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, MenuItem, Select,
  FormControl, InputLabel, SelectChangeEvent, Divider,
  Paper, Stack, Card, CardContent,
} from '@mui/material';
import { Add, Search, LocationOn, LocationCity, Public, Apartment } from '@mui/icons-material';
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

const STAT_CARDS = [
  { key: 'total',     label: 'TOTAL ADDRESSES', subtitle: 'Registered locations', color: '#9c27b0', icon: <LocationOn sx={{ fontSize: 28 }} /> },
  { key: 'dubai',     label: 'DUBAI',            subtitle: 'Locations in Dubai',   color: '#1976d2', icon: <LocationCity sx={{ fontSize: 28 }} /> },
  { key: 'abu_dhabi', label: 'ABU DHABI',        subtitle: 'Locations in Abu Dhabi', color: '#2e7d32', icon: <Public sx={{ fontSize: 28 }} /> },
  { key: 'sharjah',  label: 'SHARJAH',           subtitle: 'Locations in Sharjah', color: '#ed6c02', icon: <Apartment sx={{ fontSize: 28 }} /> },
];

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
          <LocationOn sx={{ fontSize: 18, color: 'primary.main', flexShrink: 0 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: 1.3 }}>{row.building}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>{row.area}</Typography>
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
  customerId: '', label: '', area: '', building: '', floor: '', apartment: '', cityId: '',
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

  // Always fetch all for stats; filtered separately for the table
  const { data: allAddresses } = useAddresses();
  const filterParams = (customerFilter || cityFilter)
    ? { ...(customerFilter && { customerId: customerFilter }), ...(cityFilter && { cityId: cityFilter }) }
    : undefined;
  const { data: addresses, isLoading, error } = useAddresses(filterParams);
  const createAddress = useCreateAddress();

  const stats = {
    total:     allAddresses?.length ?? 0,
    dubai:     allAddresses?.filter(a => a.cityId === 'dubai').length ?? 0,
    abu_dhabi: allAddresses?.filter(a => a.cityId === 'abu_dhabi').length ?? 0,
    sharjah:   allAddresses?.filter(a => a.cityId === 'sharjah').length ?? 0,
  };

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
    <Box sx={{ p: 3, bgcolor: '#f0f2f5', minHeight: '100vh' }}>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Addresses</Typography>
          <Typography variant="body2" color="text.secondary">Manage registered customer locations</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setDialogOpen(true)}
          sx={{ textTransform: 'none', fontWeight: 600, px: 2.5 }}
        >
          New Address
        </Button>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, mb: 3 }}>
        {STAT_CARDS.map(({ key, label, subtitle, color, icon }) => (
          <Card
            key={key}
            elevation={0}
            sx={{
              borderTop: `4px solid ${color}`,
              bgcolor: 'white',
              borderRadius: 2,
              cursor: key !== 'total' ? 'pointer' : 'default',
              transition: 'box-shadow 0.15s',
              '&:hover': key !== 'total' ? { boxShadow: 3 } : {},
            }}
            onClick={() => {
              if (key !== 'total') setCityFilter(cityFilter === key ? '' : key);
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 0.8, color: 'text.secondary' }}>
                {label}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                <Typography variant="h3" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  {stats[key as keyof typeof stats]}
                </Typography>
                <Box sx={{ color, opacity: 0.8 }}>{icon}</Box>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Table Card */}
      <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Table Toolbar */}
        <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: '#fafafa' }}>
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: 'white', border: '1px solid', borderColor: 'divider',
            borderRadius: '8px', px: 1.5, height: 38, width: 240,
            '&:focus-within': { borderColor: 'primary.main', boxShadow: '0 0 0 3px rgba(25,118,210,0.1)' },
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}>
            <Search sx={{ fontSize: 17, color: 'text.disabled', flexShrink: 0 }} />
            <input
              placeholder="Search by customer…"
              value={customerInput}
              onChange={(e) => setCustomerInput(e.target.value)}
              style={{
                border: 'none', outline: 'none', background: 'transparent',
                fontSize: 13.5, width: '100%', color: 'inherit', fontFamily: 'inherit',
              }}
            />
            {customerInput && (
              <Box
                component="span"
                onClick={() => setCustomerInput('')}
                sx={{ fontSize: 16, color: 'text.disabled', cursor: 'pointer', lineHeight: 1, '&:hover': { color: 'text.primary' } }}
              >×</Box>
            )}
          </Box>

          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 0.75,
            bgcolor: 'white', border: '1px solid', borderColor: cityFilter ? 'primary.main' : 'divider',
            borderRadius: '8px', px: 1.25, height: 38, minWidth: 130,
            position: 'relative', cursor: 'pointer',
            boxShadow: cityFilter ? '0 0 0 3px rgba(25,118,210,0.1)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}>
            <Select
              value={cityFilter}
              onChange={(e: SelectChangeEvent) => setCityFilter(e.target.value)}
              displayEmpty
              variant="standard"
              disableUnderline
              sx={{
                fontSize: 13.5, width: '100%',
                '& .MuiSelect-select': { p: 0, pr: '24px !important', color: cityFilter ? 'primary.main' : 'text.secondary', fontWeight: cityFilter ? 600 : 400 },
                '& .MuiSelect-icon': { right: 0, color: cityFilter ? 'primary.main' : 'text.disabled' },
              }}
            >
              <MenuItem value="" sx={{ fontSize: 13.5 }}>All cities</MenuItem>
              <MenuItem value="dubai" sx={{ fontSize: 13.5 }}>Dubai</MenuItem>
              <MenuItem value="abu_dhabi" sx={{ fontSize: 13.5 }}>Abu Dhabi</MenuItem>
              <MenuItem value="sharjah" sx={{ fontSize: 13.5 }}>Sharjah</MenuItem>
            </Select>
          </Box>

          {(customerInput || cityFilter) && (
            <Box
              component="span"
              onClick={() => { setCustomerInput(''); setCityFilter(''); }}
              sx={{ fontSize: 13, color: 'text.secondary', cursor: 'pointer', px: 1, '&:hover': { color: 'text.primary' } }}
            >
              Clear
            </Box>
          )}

          {addresses && (
            <Typography variant="body2" color="text.disabled" sx={{ ml: 'auto', fontSize: 12.5 }}>
              {addresses.length} {addresses.length === 1 ? 'result' : 'results'}
            </Typography>
          )}
        </Box>

        {/* DataGrid */}
        <Box sx={{ height: 560 }}>
          <DataGrid
            rows={addresses || []}
            columns={columns}
            loading={isLoading}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            onRowClick={(params) => navigate(`/addresses/${params.row.id}`)}
            sx={{
              border: 'none',
              cursor: 'pointer',
              '& .MuiDataGrid-columnHeaders': { bgcolor: '#fafafa', borderBottom: '1px solid', borderColor: 'divider' },
              '& .MuiDataGrid-columnHeaderTitle': { fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: 0.5, color: 'text.secondary' },
              '& .MuiDataGrid-cell': { borderBottomColor: 'divider' },
              '& .MuiDataGrid-row:hover': { bgcolor: '#f5f7fa' },
            }}
            rowHeight={56}
          />
        </Box>
      </Paper>

      {/* New Address Dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add New Address</DialogTitle>
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
          <Button onClick={handleDialogClose} sx={{ textTransform: 'none' }}>Cancel</Button>
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
