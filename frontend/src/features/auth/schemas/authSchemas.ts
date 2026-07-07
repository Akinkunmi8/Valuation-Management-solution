import { z } from 'zod'
import { SUPPORTED_COUNTRIES } from '../types/authTypes'

export const welcomeSchema = z.object({
  country: z.enum(SUPPORTED_COUNTRIES),
})

export const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/,
    'Password must contain uppercase, lowercase, number and special character',
  ),
    role: z.enum([
    'RM',
    'CM',
    'CMS',
    'BM',
    'VALUER',
    'AUDIT',
    'ADMIN',
  ]),
})

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  softToken: z.string().min(8, "Wrong token").max(8, 'wrong token')
})

export const verificationSchema = z.object({
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit verification code'),
})
export type WelcomeFormValues = z.infer<typeof welcomeSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
export type VerificationFormValues = z.infer<typeof verificationSchema>
