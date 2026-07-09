

import type {
  AuthState,
  AuthUser,
  SupportedCountry,
} from '../types/authTypes'


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
      solId: null,
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
      solId: null,
    }
  }

  return {
    selectedCountry: storedCountry,
    token: user.token,
    fullName: user.fullName,
    email: user.email,
    roles: user.roles,
    isAuthenticated: true,
      solId: null,
  }
}
