import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AddressAPI } from '../../../api/AddressAPI';

export const ADDRESSES_QUERY_KEY = ['addresses'];
export const ADDRESS_DETAILS_QUERY_KEY = (id: string) => ['addresses', id];

export function useAddresses(params?: { customerId?: string; cityId?: string }) {
  return useQuery({
    queryKey: [...ADDRESSES_QUERY_KEY, params],
    queryFn: () => AddressAPI.fetchAddresses(params),
  });
}

export function useAddressDetails(addressId: string) {
  return useQuery({
    queryKey: ADDRESS_DETAILS_QUERY_KEY(addressId),
    queryFn: () => AddressAPI.fetchAddressDetails(addressId),
    enabled: !!addressId,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddressAPI.createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADDRESSES_QUERY_KEY });
    },
  });
}
