import { mockUsers } from './mockUsers'
import type { MockUser } from '../types/authTypes'

const STORAGE_KEY = 'cvms.users'

export const getUsers = (): MockUser[] => {
  const stored =
    localStorage.getItem(STORAGE_KEY)

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mockUsers),
    )

    return mockUsers
  }

  return JSON.parse(stored)
}

export const saveUsers = (
  users: MockUser[],
) => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(users),
  )
}