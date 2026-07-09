import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type AuthState,
  type AuthUser,
  // type LoginResponse,
  type SupportedCountry,
} from "../types/authTypes";

const initialState: AuthState = {
  selectedCountry: null,
  token: null,
  fullName: null,
  email: null,
  roles: [],
  isAuthenticated: false,
  solId: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCountry: (state, action: PayloadAction<SupportedCountry>) => {
      state.selectedCountry = action.payload;
    },
    // setLoginChallenge: (state, action: PayloadAction<LoginResponse>) => {
    //   state.role = action.payload.role
    //   state.mfaMethod = action.payload.mfaMethod
    //   state.isVerified = false
    // },
    loginSuccess: (state, action: PayloadAction<AuthUser>) => {
      state.token = action.payload.token;
      state.fullName = action.payload.fullName;
      state.email = action.payload.email;
      state.roles = action.payload.roles;
      state.isAuthenticated = true;
      state.solId = action.payload.solId;
    },

    logout: (state) => {
      state.token = null;
      state.fullName = null;
      state.email = null;
      state.roles = [];
      state.isAuthenticated = false;
    },
    // completeVerification: (state) => {
    //   state.isVerified = true;
    // },
    // resetAuth: (state) => {
    //   state.role = null;
    //   state.mfaMethod = null;
    //   state.isVerified = false;
    // },
  },
});

export const {
  loginSuccess,
  logout,
  setCountry,
  // setLoginChallenge,
} = authSlice.actions;
export default authSlice.reducer;
