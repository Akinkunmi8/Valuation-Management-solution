import type { AuthState, AuthUser } from "../types/authTypes";

const AUTH_STORAGE_KEY = "cvms.auth";

export const saveAuth = (user: AuthUser) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
};

export const getStoredAuth = (): AuthUser | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  const user = JSON.parse(stored) as AuthUser;

  const isExpired = new Date(user.expiration) <= new Date();

  if (isExpired) {
    clearStoredAuth();
    return null;
  }

  return user;
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getStoredAuthState = (
  selectedCountry: AuthState["selectedCountry"],
): AuthState => {
  const user = getStoredAuth();

  if (!user) {
    return {
      selectedCountry,
      token: null,
      fullName: null,
      email: null,
      roles: [],
      isAuthenticated: false,
      solId: null,
    };
  }

  return {
    selectedCountry,
    token: user.token,
    fullName: user.fullName,
    email: user.email,
    roles: user.roles,
    isAuthenticated: true,
    solId: null,
  };
};
