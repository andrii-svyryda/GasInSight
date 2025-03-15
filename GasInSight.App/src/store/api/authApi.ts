import { baseApi } from "./baseApi";
import { LoginRequest, TokenResponse, User } from "../../types/auth";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<TokenResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/token",
        method: "POST",
        body: new URLSearchParams({
          username: credentials.username,
          password: credentials.password,
        }).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),

    refreshAccessToken: builder.mutation<TokenResponse, void>({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
  }),
});
