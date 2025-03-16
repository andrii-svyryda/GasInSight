import { baseApi } from './baseApi';
import { User, UserFacilityPermission } from '../../types/user';

interface GetUsersParams {
  page: number;
  pageSize: number;
}

export interface UpdateUserData {
  id: number;
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface UserPermissionData {
  userId: number;
  facilityId: string;
  permissionType: string;
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

    createUser: builder.mutation<User, CreateUserData>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    deleteUser: builder.mutation<User, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_, __, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' }
      ],
    }),

    updateUser: builder.mutation<User, UpdateUserData>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_, __, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' }
      ],
    }),

    getUserPermissions: builder.query<UserFacilityPermission[], number>({
      query: (userId) => ({
        url: '/permissions',
        params: { user_id: userId },
      }),
      providesTags: (_, __, userId) => [{ type: 'UserPermissions', id: userId }],
    }),

    createPermission: builder.mutation<UserFacilityPermission, UserPermissionData>({
      query: (data) => ({
        url: '/permissions',
        method: 'POST',
        body: {
          user_id: data.userId,
          facility_id: data.facilityId,
          permission_type: data.permissionType
        },
      }),
      invalidatesTags: (_, __, { userId }) => [{ type: 'UserPermissions', id: userId }],
    }),

    deletePermission: builder.mutation<UserFacilityPermission, number>({
      query: (id) => ({
        url: `/permissions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) => [{ type: 'UserPermissions', id: result?.userId }],
    }),
  }),
});
