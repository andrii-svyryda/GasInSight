import { baseApi } from './baseApi';
import { User } from '../../types/user';

interface GetUsersParams {
  page: number;
  pageSize: number;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<{ users: User[]; total: number }, GetUsersParams>({
      query: ({ page, pageSize }) => ({
        url: '/users',
        params: { page, page_size: pageSize },
      }),
      providesTags: (result) => 
        result 
          ? [
              ...result.users.map(({ id }) => ({ type: 'User' as const, id })),
              { type: 'User', id: 'LIST' },
            ]
          : [{ type: 'User', id: 'LIST' }],
    }),
    
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (_, __, id) => [{ type: 'User', id }],
    }),
  }),
});
