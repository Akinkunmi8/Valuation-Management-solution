import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'

import Button from '../../../shared/ui/button/Button'
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from '../../../shared/ui/card/Card'
import Input from '../../../shared/ui/input/Input'
import Select from '../../../shared/ui/select/Select'
import loginImage from "../../../assets/login_bg2.png"
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas'

import { ROUTES } from '../../../shared/constants/routes'
// import { registerUser } from '../services/registerServices'
import { useRegisterStaffMutation } from '../api/authApi'


const roleOptions = [
  { label: 'RM', value: 'RM' },
  { label: 'CM', value: 'CM' },
  { label: 'CMS', value: 'CMS' },
  { label: 'BM', value: 'BM' },
  { label: 'VALUER', value: 'VALUER' },
  { label: 'AUDIT', value: 'AUDIT' },
  { label: 'ADMIN', value: 'ADMIN' },
]

const RegisterPage = () => {
  const navigate = useNavigate()
  const [registerStaff] =
    useRegisterStaffMutation()


  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (
    values: RegisterFormValues,
  ) => {
    try {
      const response =
        await registerStaff({
          username: values.username,
          password: values.password,
          role: values.role,
        }).unwrap()

      console.log(response)

      navigate(ROUTES.auth.login)
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'Registration failed',
      )
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-lg items-center justify-center px-4">

      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-105 object-cover -z-10"
        src={loginImage}
      />
      <div className="fixed inset-0 bg-black/60 -z-5" />

      <Card className="w-full bg-transparent">
        <CardHeader>
          <CardTitle className='text-white text-6xl'>
            Register User
          </CardTitle>

          {/* <CardDescription>
            Development only.
          </CardDescription> */}
        </CardHeader>

        <CardContent>
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Username"
               labelClassName='text-white'
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              type="password"
              label="Password"
               labelClassName='text-white'
              error={errors.password?.message}
              {...register('password')}
            />

            <Select
              label="Role"
               labelClassName='text-white'
              error={errors.role?.message}
              options={roleOptions}
              placeholder="Select role"
              {...register('role')}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isSubmitting}
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}

export default RegisterPage