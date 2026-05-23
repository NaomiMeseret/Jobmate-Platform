import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    initializeChapa: builder.mutation<
      {
        checkout_url: string;
        tx_ref: string;
        provider: string;
        plan_id: string;
      },
      { plan_id: string; country: string }
    >({
      query: (body) => ({
        url: "/payments/chapa/initialize",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useInitializeChapaMutation } = paymentApi;
