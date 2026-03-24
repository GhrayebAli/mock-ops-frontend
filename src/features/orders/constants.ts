export const STATUS_COLORS: Record<string, 'warning' | 'info' | 'success' | 'error' | 'default'> = {
  pending: 'warning',
  in_progress: 'info',
  delivered: 'success',
  cancelled: 'error',
};

export const PRIORITY_COLORS: Record<string, 'error' | 'warning' | 'default'> = {
  high: 'error',
  normal: 'warning',
  low: 'default',
};
