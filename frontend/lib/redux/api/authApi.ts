import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";
import { User } from "@/lib/types/auth";

// API endpoints
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    login: builder.mutation<{ message: string; user: User }, { email: string; password: string }>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    register: builder.mutation<{ message: string; user_id: string; email: string }, { firstName:string;  lastName:string; email: string; password: string; otp: string }>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    requestOtp: builder.mutation<{ success: boolean }, { email: string }>({
      query: (body) => ({ url: "/auth/request-otp", method: "POST", body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    requestPasswordReset: builder.mutation<{ success: boolean }, { email: string }>({
      query: (body) => ({
        url: "/auth/request-password-reset-otp",
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<{ success: boolean }, { email: string; otp: string; new_password: string }>({
      query: ({ email, otp, new_password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { email, otp, new_password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestOtpMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
