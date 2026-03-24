import { useQuery } from '@tanstack/react-query';
import { AddressAPI } from '../../../api/AddressAPI';

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: AddressAPI.fetchAddresses,
  });
}
