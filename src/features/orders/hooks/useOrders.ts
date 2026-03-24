import { useQuery } from '@tanstack/react-query';
import { OrderAPI } from '../../../api/OrderAPI';

export const ORDERS_QUERY_KEY = ['orders'];
export const ORDER_DETAILS_QUERY_KEY = (id: string) => ['orders', id];

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: OrderAPI.fetchOrders,
  });
}

export function useOrderDetails(orderId: string) {
  return useQuery({
    queryKey: ORDER_DETAILS_QUERY_KEY(orderId),
    queryFn: () => OrderAPI.fetchOrderDetails(orderId),
    enabled: !!orderId,
  });
}
