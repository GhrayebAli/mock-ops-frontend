import { useQuery } from '@tanstack/react-query';
import { AddressAPI } from '../../../api/AddressAPI';

export const ADDRESSES_QUERY_KEY = ['addresses'];

export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_QUERY_KEY,
    queryFn: AddressAPI.fetchAddresses,
  });
}
