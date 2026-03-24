import { INTERNAL_OPS_API } from './client';
import type { Address } from '../interfaces/Address';

export const AddressAPI = {
  fetchAddresses: async (): Promise<Address[]> => {
    const response = await INTERNAL_OPS_API.request<{ data: Address[] }>({
      method: 'GET',
      url: '/addresses',
    });
    return response.data.data;
  },

  fetchAddressDetails: async (addressId: string): Promise<Address> => {
    const response = await INTERNAL_OPS_API.request<{ data: Address }>({
      method: 'GET',
      url: `/addresses/${addressId}`,
    });
    return response.data.data;
  },
};
