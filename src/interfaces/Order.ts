export interface Order {
  id: string;
  customerAlphaId: string;
  status: 'pending' | 'in_progress' | 'delivered' | 'cancelled';
  orderType: string;
  cityId: string;
  totalAmount: number;
  currency: string;
}
