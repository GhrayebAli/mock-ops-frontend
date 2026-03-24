import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Chip, CircularProgress, Button, Stepper, Step, StepLabel } from '@mui/material';
import { ArrowBack, Cancel } from '@mui/icons-material';
import { useOrderDetails } from '../hooks/useOrders';

const STATUS_COLORS: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
  pending: 'warning',
  in_progress: 'info',
  delivered: 'success',
  cancelled: 'error',
};

const FLOW_STEPS = ['pending', 'in_progress', 'delivered'];

function OrderStatusStepper({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
        <Cancel fontSize="small" />
        <Typography variant="body2" color="error">Order cancelled</Typography>
      </Box>
    );
  }

  const activeStep = FLOW_STEPS.indexOf(status);

  return (
    <Stepper activeStep={activeStep} sx={{ pt: 1, pb: 1 }}>
      {FLOW_STEPS.map((step) => (
        <Step key={step}>
          <StepLabel>{step.replace('_', ' ')}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
}

function Field({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
      <Typography sx={{ width: 140, flexShrink: 0, color: 'text.secondary' }}>{label}</Typography>
      <Typography>{value ?? '—'}</Typography>
    </Box>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrderDetails(orderId!);

  if (isLoading) return <Box sx={{ p: 3, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" sx={{ p: 3 }}>Failed to load order</Typography>;
  if (!order) return <Typography sx={{ p: 3 }}>Order not found</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/orders')} sx={{ mb: 2 }}>
        Back to Orders
      </Button>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h4">Order Details</Typography>
        <Chip
          label={order.status}
          color={STATUS_COLORS[order.status] ?? 'default'}
          size="small"
        />
      </Box>
      <Paper sx={{ p: 3, maxWidth: 600, mb: 3 }}>
        <OrderStatusStepper status={order.status} />
      </Paper>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Field label="Order ID" value={order.id} />
        <Field label="Customer" value={order.customerAlphaId} />
        <Field label="Type" value={order.orderType} />
        <Field label="City" value={order.cityId} />
        <Field label="Total Amount" value={order.totalAmount != null ? `${order.totalAmount} ${order.currency ?? ''}`.trim() : undefined} />
        <Field label="Priority" value={order.priority} />
        <Field label="Notes" value={order.notes} />
        <Field label="Created" value={order.createdAt ? new Date(order.createdAt).toLocaleString() : undefined} />
      </Paper>
    </Box>
  );
}
