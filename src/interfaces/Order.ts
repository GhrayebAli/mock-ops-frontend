export interface Order {
  id: string;
  customerAlphaId: string;
  status: string;
  orderType?: string;
  cityId?: string;
  totalAmount?: number;
  currency?: string;
  notes?: string;
  priority?: string;
  createdAt: string;
}
