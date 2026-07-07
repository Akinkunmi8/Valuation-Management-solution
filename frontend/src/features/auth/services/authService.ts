// import { getUsers } from "../mock/mockAuthRepository";
// import type {
//   LoginFormValues,
//   VerificationFormValues,
// } from "../schemas/authSchemas";
// import type {
//   // AuthRole,
//   // LoginResponse,
//   // MfaMethod,
//   SupportedCountry,
// } from "../types/authTypes";

import type {
  AuthState,
  AuthUser,
  SupportedCountry,
} from '../types/authTypes'

// const countryMfaMethods: Record<SupportedCountry, MfaMethod> = {
//   Ghana: "EMAIL_OTP",
//   Kenya: "AUTHENTICATOR_APP",
//   Nigeria: "SMS_OTP",
//   "South Africa": "EMAIL_OTP",
// };

// export const login = async (
//   credentials: LoginFormValues,
//   country: SupportedCountry,
// ): Promise<LoginResponse> => {
//   const users = getUsers();

//   console.log("Users:", users);

//   const user = users.find(
//     (user) =>
//       user.username.toLowerCase() === credentials.username.toLowerCase() &&
//       user.password === credentials.password,
//   );

//   if (!user) {
//     throw new Error("Invalid username or password");
//   }

//   return {
//     roles: user.roles[0],
//     mfaMethod: countryMfaMethods[country],
//   };
// };

// export const verifyMfa = async (
//   payload: VerificationFormValues,
// ): Promise<{ success: boolean }> => {
//   return Promise.resolve({ success: payload.code.length === 6 });
// };




const AUTH_KEY = 'cvms.auth'
const COUNTRY_KEY = 'cvmp.selectedCountry'

export const saveAuth = (
  user: AuthUser,
) => {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify(user),
  )
}

export const clearAuth = () => {
  localStorage.removeItem(AUTH_KEY)
}

export const saveCountry = (
  country: SupportedCountry,
) => {
  localStorage.setItem(
    COUNTRY_KEY,
    country,
  )
}

export const buildInitialAuthState =
(): AuthState => {
  const storedCountry =
    localStorage.getItem(COUNTRY_KEY) as SupportedCountry | null

  const storedAuth =
    localStorage.getItem(AUTH_KEY)

  if (!storedAuth) {
    return {
      selectedCountry: storedCountry,
      token: null,
      fullName: null,
      email: null,
      roles: [],
      isAuthenticated: false,
    }
  }

  const user =
    JSON.parse(storedAuth) as AuthUser

  if (
    new Date(user.expiration) <=
    new Date()
  ) {
    localStorage.removeItem(
      AUTH_KEY,
    )

    return {
      selectedCountry:storedCountry,
      token: null,
      fullName: null,
      email: null,
      roles: [],
      isAuthenticated: false,
    }
  }

  return {
    selectedCountry: storedCountry,
    token: user.token,
    fullName: user.fullName,
    email: user.email,
    roles: user.roles,
    isAuthenticated: true,
  }
}
