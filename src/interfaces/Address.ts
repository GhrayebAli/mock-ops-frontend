export interface Address {
  id: string;
  customerId: string;
  label?: string;
  area?: string;
  building?: string;
  floor?: string;
  apartment?: string;
  cityId?: string;
  latitude?: number;
  longitude?: number;
}
