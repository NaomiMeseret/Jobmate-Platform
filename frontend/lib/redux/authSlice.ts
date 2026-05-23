import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null | undefined;
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  accessToken:
    typeof window !== "undefined" && localStorage.getItem("accessToken")
      ? localStorage.getItem("accessToken")
      : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
  state,
  action: PayloadAction<{ user: User; accessToken?: string }>
) => {
  const accessToken = action.payload.accessToken || action.payload.user.acces_token;
  state.user = { ...action.payload.user, acces_token: accessToken };
  state.accessToken = accessToken;

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  localStorage.setItem("user", JSON.stringify(state.user));
},

    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, clearAuth } = authSlice.actions;
export default authSlice.reducer;
