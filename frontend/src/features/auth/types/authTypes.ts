export const SUPPORTED_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
] as const;

export const COUNTRY_STORAGE_KEY = "cvmp.selectedCountry";

export type SupportedCountry = (typeof SUPPORTED_COUNTRIES)[number];

export type AuthRole =
  | "RM"
  | "CM"
  | "CMS"
  | "BM"
  | "VALUER"
  | "AUDIT"
  | "ADMIN";

export type AuthUser = {
  token: string;
  expiration: string;
  fullName: string;
  email: string;
  roles: AuthRole[];
  solId: string;
};

export type MfaMethod = "EMAIL_OTP" | "SMS_OTP" | "AUTHENTICATOR_APP";

// Login Request
export type LoginRequest = {
  username: string;
  password: string;
  softToken: string;
};

export type LoginResponse = {
  responseCode: string;
  message: string;
  user: AuthUser;
};

export type AuthState = {
  token: string | null;
  fullName: string | null;
  email: string | null;
  roles: AuthRole[];
  selectedCountry: SupportedCountry | null;
  isAuthenticated: boolean;
  solId: string | null;
};
