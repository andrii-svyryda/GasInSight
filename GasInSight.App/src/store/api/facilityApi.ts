import { baseApi } from './baseApi';
import { Facility } from '../../types/facility';

export const facilityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFacilities: builder.query<Facility[], void>({
      query: () => '/facilities',
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'Facility' as const, id })),
              { type: 'Facility', id: 'LIST' },
            ]
          : [{ type: 'Facility', id: 'LIST' }],
    }),
    
    getFacilityById: builder.query<Facility, string>({
      query: (id) => `/facilities/${id}`,
      providesTags: (_, __, id) => [{ type: 'Facility', id }],
    }),
  }),
});

export const { useGetFacilitiesQuery, useGetFacilityByIdQuery } = facilityApi;
