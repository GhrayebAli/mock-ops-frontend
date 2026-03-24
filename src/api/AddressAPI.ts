import { INTERNAL_OPS_API } from './client';
import type { Address } from '../interfaces/Address';

export const AddressAPI = {
  fetchAddresses: async (): Promise<Address[]> => {
    const res = await INTERNAL_OPS_API.get('/addresses');
    return res.data.data;
  },
};
