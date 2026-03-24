import { useQuery } from '@tanstack/react-query';
import { OrderAPI } from '../../../api/OrderAPI';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: OrderAPI.fetchOrders,
  });
}
