import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  type AuthState,
  type AuthUser,
  // type LoginResponse,
  type SupportedCountry,
} from "../types/authTypes";

const AUTH_KEY = "cvms.auth";

// Helper function to read from localStorage synchronously on initial load
const loadInitialAuthState = (): AuthState => {
  try {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      return {
        selectedCountry: parsed.selectedCountry ?? null,
        token: parsed.token ?? null,
        fullName: parsed.fullName ?? null,
        email: parsed.email ?? null,
        roles: Array.isArray(parsed.roles) ? parsed.roles : [],
        isAuthenticated: Boolean(parsed.token),
        solId: parsed.solId ?? null,
      };
    }
  } catch (error) {
    console.error("Failed to parse auth state from localStorage:", error);
  }

  return {
    selectedCountry: null,
    token: null,
    fullName: null,
    email: null,
    roles: [],
    isAuthenticated: false,
    solId: null,
  };
};

// const initialState: AuthState = {
//   selectedCountry: null,
//   token: null,
//   fullName: null,
//   email: null,
//   roles: [],
//   isAuthenticated: false,
//   solId: null
// };

const authSlice = createSlice({
  name: "auth",
  initialState: loadInitialAuthState(),
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

      // Save state to localStorage
      localStorage.setItem(
        AUTH_KEY,
        JSON.stringify({
          selectedCountry: state.selectedCountry,
          token: state.token,
          fullName: state.fullName,
          email: state.email,
          roles: state.roles,
          solId: state.solId,
        }),
      );
    },

    logout: (state) => {
      state.token = null;
      state.fullName = null;
      state.email = null;
      state.roles = [];
      state.solId = null;
      state.isAuthenticated = false;
      localStorage.removeItem(AUTH_KEY);
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
