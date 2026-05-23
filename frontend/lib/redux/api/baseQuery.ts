import {
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { clearAuth, setCredentials } from "../authSlice";
import type { User } from "@/lib/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://g6-jobmate-3.onrender.com";

export const getAccessToken = (state: RootState) =>
  state.auth.accessToken || state.auth.user?.acces_token || null;

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getAccessToken(getState() as RootState);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const authRoutesWithoutRefresh = [
  "/auth/login",
  "/auth/register",
  "/auth/request-otp",
  "/auth/request-password-reset-otp",
  "/auth/reset-password",
  "/auth/refresh",
];

function getRequestUrl(args: string | FetchArgs) {
  return typeof args === "string" ? args : args.url;
}

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  const url = getRequestUrl(args);
  const shouldSkipRefresh = authRoutesWithoutRefresh.some((route) =>
    url.startsWith(route)
  );

  if (
    !shouldSkipRefresh &&
    (result.error as FetchBaseQueryError | undefined)?.status === 401
  ) {
    const refresh = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extraOptions
    );

    if (refresh.data && typeof refresh.data === "object") {
      const data = refresh.data as { access_token?: string; user?: User };
      const state = api.getState() as RootState;
      const user = data.user || state.auth.user;

      if (user && data.access_token) {
        api.dispatch(
          setCredentials({
            user: { ...user, acces_token: data.access_token },
            accessToken: data.access_token,
          })
        );
        result = await rawBaseQuery(args, api, extraOptions);
      }
    } else {
      api.dispatch(clearAuth());
    }
  }

  return result;
};
