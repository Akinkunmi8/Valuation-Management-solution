import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate } from 'react-router'
import Button from '@/shared/ui/button/Button'
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card/Card'
import Input from '@/shared/ui/input/Input'
import Select from '@/shared/ui/select/Select'
import loginImage from "@/assets/login_bg2.png"
import { registerSchema, type RegisterFormValues } from '../schemas/authSchemas'

import { ROUTES } from '@/shared/constants/routes'
// import { registerUser } from '../services/registerServices'
import { useCreateValuerProfileMutation, useRegisterStaffMutation } from '../api/authApi'
import { notify } from '@/shared/lib/toast'


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

  //For Valuer Reg (Temp)
  const [createValuerProfile] =
    useCreateValuerProfileMutation()

  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const selectedRole = useWatch({
    control,
    name: 'role',
  })

  const onSubmit = async (
    values: RegisterFormValues,
  ) => {
    try {

      // Valuer create Profile (Temp)
      if (values.role === 'VALUER') {

        await createValuerProfile({

          valuersName: values.valuersName,

          valuerEmail: values.valuerEmail,

          valuerAddress: values.valuerAddress,

          telephoneNumbers: values.telephoneNumbers,

          accountManager: values.accountManager,

          accountNumber: values.accountNumber,

          username: values.username,

          password: values.password,
        }).unwrap()
      } else {
        await registerStaff({
          username: values.username,
          password: values.password,
          role: values.role,
        }).unwrap()
      }
      notify.success("Registration Successful");
      navigate(ROUTES.auth.login)
    } catch (error) {
      notify.apiError(error, "Registration Failed")
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
        
            {/* Register User */}
            <CardTitle className="text-white text-6xl">
              {selectedRole === 'VALUER'
                ? 'Register Valuer'
                : 'Register User'}
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



            {selectedRole === 'VALUER' && (

              <div className="space-y-5 rounded-xl border border-border bg-surface/5 p-5">

                <Input
                  label="Valuer Company Name"
                  labelClassName="text-white"
                  error={errors.valuersName?.message}
                  {...register('valuersName')}
                />

                <Input
                  label="Valuer Email"
                  labelClassName="text-white"
                  error={errors.valuerEmail?.message}
                  {...register('valuerEmail')}
                />

                <Input
                  label="Company Address"
                  labelClassName="text-white"
                  error={errors.valuerAddress?.message}
                  {...register('valuerAddress')}
                />

                <Input
                  label="Telephone Number"
                  labelClassName="text-white"
                  error={errors.telephoneNumbers?.message}
                  {...register('telephoneNumbers')}
                />

                <Input
                  label="Account Manager"
                  labelClassName="text-white"
                  error={errors.accountManager?.message}
                  {...register('accountManager')}
                />

                <Input
                  label="Settlement Account Number"
                  labelClassName="text-white"
                  error={errors.accountNumber?.message}
                  {...register('accountNumber')}
                />

              </div>

            )}

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