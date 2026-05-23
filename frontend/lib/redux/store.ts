import { configureStore } from "@reduxjs/toolkit";
import { cvApi } from "./api/cvApi";
import { generalApi } from "./api/generalApi";
import { authApi } from "./api/authApi";
import authReducer from "./authSlice";

import { jobApi } from "./api/JobApi";
import { interviewApi } from "./api/interviewApi";
import { paymentApi } from "./api/paymentApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [cvApi.reducerPath]: cvApi.reducer,
    [generalApi.reducerPath]: generalApi.reducer,

    [jobApi.reducerPath]: jobApi.reducer,

    [interviewApi.reducerPath]: interviewApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(cvApi.middleware)
      .concat(generalApi.middleware)

      .concat(jobApi.middleware)

      .concat(interviewApi.middleware)
      .concat(paymentApi.middleware),

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
