import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FiArrowRight, FiLock, FiMail } from 'react-icons/fi'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'

import Button from '@/shared/ui/button/Button'

import Input from '@/shared/ui/input/Input'
import loginImage from "@/assets/login_bg2.png"
import { getDashboardRouteForRole, ROUTES } from '@/shared/constants/routes'
import { loginSchema, type LoginFormValues } from '../schemas/authSchemas'
// import { login } from '../services/authService'
// import { setLoginChallenge } from '../store/authSlice'
import { useLoginStaffMutation } from '../api/authApi'
import { loginSuccess } from '../store/authSlice'
import { saveAuth } from '../utils/authStorage'
import { notify } from '@/shared/lib/toast'
import { NOTIFY_TITLES } from '@/shared/constants/notifyTitles'




const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const selectedCountry = useAppSelector((state) => state.auth.selectedCountry)

  const [loginStaff] = useLoginStaffMutation()

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
      softToken: ''
    },
  })

  if (!selectedCountry) {
    return <Navigate to={ROUTES.welcome} replace />
  }

  const onSubmit = async (values: LoginFormValues) => {
    try {

      const response =
        await loginStaff({
          username: values.username,
          password: values.password,
          softToken: values.softToken,
        }).unwrap()

      notify.success(
        NOTIFY_TITLES.LOGIN_SUCCESS,
        "You have successfully login"
      )

      dispatch(
        loginSuccess(response.user)
      )
      // Save to localStorage
      saveAuth(response.user)
      // dispatch(setLoginChallenge(response))
      const role = response.user.roles[0]
      if (!role) {
        throw new Error('No role returned from server')
      }
      navigate(
        getDashboardRouteForRole(role),
        { replace: true }
      )
      // navigate(ROUTES.auth.verify)
    }
    catch (error) {
      notify.apiError(
        error,
        NOTIFY_TITLES.LOGIN_FAILED,
      )
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8 
    ">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-105 object-cover -z-10"
        src={loginImage}
      />
      <div className="fixed inset-0 bg-black/60 -z-5" />

      <div className=" ">
        <div className='mb-12'>
          <h1 className='text-5xl text-white'>Login</h1>

        </div>
        <div>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
              autoComplete="Username"
              error={errors.username?.message}
              label="Username"
              labelClassName='text-white'
              leftAdornment={<FiMail aria-hidden="true" className="h-4 w-4 " />}
              placeholder="Enter your Username"
              type="text"
              required
              {...register('username')}
            />

            <Input
              autoComplete="current-password"
              error={errors.password?.message}
              label="Password"
              labelClassName='text-white'
              leftAdornment={<FiLock aria-hidden="true" className="h-4 w-4" />}
              placeholder="Enter your password"
              type="password"
              required
              {...register('password')}
            />
            <Input
              // autoComplete="current-password"
              error={errors.softToken?.message}
              label="Token"
              labelClassName='text-white'
              leftAdornment={<FiLock aria-hidden="true" className="h-4 w-4" />}
              placeholder="Enter your soft token"
              type="text"
              required
              {...register('softToken')}
            />

            <Link to={"/auth/register"} className='text-blue-500 mt-4 mb-4 flex justify-end'>Register</Link>

            <Button
              className="w-full cursor-pointer"
              isLoading={isSubmitting}
              rightIcon={<FiArrowRight aria-hidden="true" />}
              type="submit"
            >
              Continue
            </Button>
          </form>
        </div>
      </div>

    </main>
  )

}

export default LoginPage
