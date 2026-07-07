import { nanoid } from '@reduxjs/toolkit'

import {
  getUsers,
  saveUsers,
} from '../mock/mockAuthRepository'

import type { AuthRole } from '../types/authTypes'

type RegisterPayload = {
  username: string
  password: string
  role: AuthRole
}

export const registerUser = async (
  payload: RegisterPayload,
) => {
  const users = getUsers()

  const exists = users.some(
    (user) =>
      user.username.toLowerCase() ===
      payload.username.toLowerCase(),
  )

  if (exists) {
    throw new Error(
      'Username already exists',
    )
  }

  users.push({
    id: nanoid(),
    ...payload,
  })

  saveUsers(users)

  return {
    success: true,
  }
}