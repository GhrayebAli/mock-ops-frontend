import { INTERNAL_OPS_API } from './client';

export interface Order {
  id: string;
  customerAlphaId: string;
  status: string;
  orderType?: string;
  cityId?: string;
  totalAmount?: number;
  currency?: string;
  createdAt: number;
}

export const OrderAPI = {
  fetchOrders: async (): Promise<Order[]> => {
    const response = await INTERNAL_OPS_API.request<{ data: Order[] }>({
      method: 'GET',
      url: '/orders',
    });
    return response.data.data;
  },
};
