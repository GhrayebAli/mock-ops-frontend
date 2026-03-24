import { apiGet } from './client';
import type { Order } from '../interfaces/Order';

export const OrderAPI = {
  fetchOrders: () => apiGet<Order[]>('/orders'),
  fetchOrderDetails: (orderId: string) => apiGet<Order>(`/orders/${orderId}`),
};
