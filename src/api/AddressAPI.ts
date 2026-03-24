import { apiGet } from './client';
import type { Address } from '../interfaces/Address';

export const AddressAPI = {
  fetchAddresses: () => apiGet<Address[]>('/addresses'),
};
