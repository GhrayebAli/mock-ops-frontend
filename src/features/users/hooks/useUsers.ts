import { useQuery } from '@tanstack/react-query';
import { UserAPI } from '../../../api/UserAPI';

export const USERS_QUERY_KEY = ['users'];
export const USER_DETAILS_QUERY_KEY = (id: string) => ['users', id];

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: UserAPI.fetchUsers,
  });
}

export function useUserDetails(userId: string) {
  return useQuery({
    queryKey: USER_DETAILS_QUERY_KEY(userId),
    queryFn: () => UserAPI.fetchUserDetails(userId),
    enabled: !!userId,
  });
}
