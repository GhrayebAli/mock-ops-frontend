import { INTERNAL_OPS_API } from './client';
import type { Order } from '../interfaces/Order';

export const OrderAPI = {
  fetchOrders: async (): Promise<Order[]> => {
    const response = await INTERNAL_OPS_API.request<{ data: Order[] }>({
      method: 'GET',
      url: '/orders',
    });
    return response.data.data;
  },

  fetchOrderDetails: async (orderId: string): Promise<Order> => {
    const response = await INTERNAL_OPS_API.request<{ data: Order }>({
      method: 'GET',
      url: `/orders/${orderId}`,
    });
    return response.data.data;
  },
};
