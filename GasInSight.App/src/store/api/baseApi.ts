import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { transformSnakeToCamel } from "../../utils/caseTransformers";
import { RootState } from "../index";
import { logout, setTokens } from "../slices/authSlice";
import { TokenResponse } from "../../types/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8000",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = (api.getState() as RootState).auth.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-token",
        method: "POST",
        params: { refresh_token: refreshToken },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const data = transformSnakeToCamel(
        refreshResult.data as Record<string, unknown>
      ) as unknown as TokenResponse;
      api.dispatch(setTokens(data));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  if (result.data) {
    result.data = transformSnakeToCamel(result.data as Record<string, unknown>);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: ["Facility", "Sensor", "SensorRecord", "User", "UserPermissions"],
});
