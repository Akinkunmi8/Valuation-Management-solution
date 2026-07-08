// import { zodResolver } from '@hookform/resolvers/zod'
// import { useForm } from 'react-hook-form'
// import { FiCheckCircle, FiKey } from 'react-icons/fi'
// import { Navigate, useNavigate } from 'react-router'
// import { useAppDispatch, useAppSelector } from '../../../app/store/hooks'
// // import Badge from '../../../shared/ui/badge/Badge'
// import Button from '../../../shared/ui/button/Button'
// import { Card, CardContent, CardDescription, CardHeader, } from '../../../shared/ui/card/Card'
// import Input from '../../../shared/ui/input/Input'
// import { getDashboardRouteForRole, ROUTES } from '../../../shared/constants/routes'
// import { verificationSchema, type VerificationFormValues } from '../schemas/authSchemas'
// import { verifyMfa } from '../services/authService'
// import { completeVerification } from '../store/authSlice'
// import type { MfaMethod } from '../types/authTypes'

// const mfaLabels: Record<MfaMethod, string> = {
//   AUTHENTICATOR_APP: 'Authenticator app',
//   EMAIL_OTP: 'Email one-time password',
//   SMS_OTP: 'SMS one-time password',
// }

// const VerificationPage = () => {
//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()
//   const { mfaMethod, role, selectedCountry } = useAppSelector((state) => state.auth)

//   const {
//     formState: { errors, isSubmitting },
//     handleSubmit,
//     register,
//   } = useForm<VerificationFormValues>({
//     resolver: zodResolver(verificationSchema),
//     defaultValues: {
//       code: '',
//     },
//   })

//   if (!selectedCountry) {
//     return <Navigate to={ROUTES.welcome} replace />
//   }

//   if (!role || !mfaMethod) {
//     return <Navigate to={ROUTES.auth.login} replace />
//   }

//   const onSubmit = async (values: VerificationFormValues) => {
//     const result = await verifyMfa(values)

//     if (result.success) {
//       dispatch(completeVerification())
//       navigate(getDashboardRouteForRole(role), { replace: true })
//     }
//   }

//   return (
//     <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
//       <div className="w-full max-w-xl">
//         <div className="mb-6 text-center">
//           <div className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary-soft text-primary">
//             <FiKey aria-hidden="true" className="h-7 w-7" />
//           </div>
//           {/* <Badge className="mt-5" variant="success" size="md">
//             {selectedCountry} verification
//           </Badge> */}
//           <h2 className="mt-6 text-4xl font-bold text-text-primary">Verify your identity</h2>
//         </div>

//         <Card
//           // className="bg-surface shadow-2xl shadow-black/30"
//           tone="elevated"
//           className="bg-surface"
//         >
//           <CardHeader>

//             <CardDescription>
//               Enter the 6-digit code from your{' '}
//               {mfaLabels[mfaMethod].toLowerCase()} to continue.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
//               <Input
//                 autoComplete="one-time-code"
//                 error={errors.code?.message}
//                 inputMode="numeric"
//                 label="Verification code"
//                 leftAdornment={<FiCheckCircle aria-hidden="true" className="h-4 w-4 text-center tracking-[0.3em]" />}
//                 maxLength={6}
//                 placeholder="000000"
//                 required
//                 {...register('code')}
//               />

//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   className="text-sm font-medium text-primary hover:text-primary-hover"
//                 >
//                   Resend code
//                 </button>
//               </div>

//               <Button className="w-full" isLoading={isSubmitting} type="submit">
//                 Verify and Continue
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </main>
//   )
// }

// export default VerificationPage
