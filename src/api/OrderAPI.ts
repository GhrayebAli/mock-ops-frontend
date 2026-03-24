import { INTERNAL_OPS_API } from './client';
import type { Order } from '../interfaces/Order';

export const OrderAPI = {
  fetchOrders: async (): Promise<Order[]> => {
    const res = await INTERNAL_OPS_API.get('/orders');
    return res.data.data;
  },
};
