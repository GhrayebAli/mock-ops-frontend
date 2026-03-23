import { INTERNAL_OPS_API } from './client';
import type { Address } from '../interfaces/Address';

export const AddressAPI = {
  fetchAddresses: async (params?: { customerId?: string; cityId?: string }): Promise<Address[]> => {
    const response = await INTERNAL_OPS_API.request<{ data: Address[] }>({
      method: 'GET',
      url: '/addresses',
      params,
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

  createAddress: async (addressData: Omit<Address, 'id'>): Promise<Address> => {
    const response = await INTERNAL_OPS_API.request<{ data: Address }>({
      method: 'POST',
      url: '/addresses',
      data: addressData,
    });
    return response.data.data;
  },
};
