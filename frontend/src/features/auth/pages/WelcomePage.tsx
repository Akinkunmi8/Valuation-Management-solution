import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { FiArrowRight } from 'react-icons/fi'
import { Navigate, useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from '@/app/store/hooks'
import welcomeImage from '@/assets/welcome.png'
import Button from '@/shared/ui/button/Button'
import { Card, CardContent } from '@/shared/ui/card/Card'
import Select from '@/shared/ui/select/Select'
import { ROUTES } from '@/shared/constants/routes'
import { welcomeSchema, type WelcomeFormValues } from '../schemas/authSchemas'
import { setCountry } from '../store/authSlice'
import { COUNTRY_STORAGE_KEY, SUPPORTED_COUNTRIES } from '../types/authTypes'

const countryOptions = SUPPORTED_COUNTRIES.map((country) => ({
  label: country,
  value: country,
}))

const WelcomePage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const selectedCountry = useAppSelector((state) => state.auth.selectedCountry)

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<WelcomeFormValues>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: selectedCountry ? { country: selectedCountry } : {},
  })

  const onSubmit = (values: WelcomeFormValues) => {
    window.localStorage.setItem(COUNTRY_STORAGE_KEY, values.country)
    dispatch(setCountry(values.country))
    navigate(ROUTES.auth.login)
  }

  if (selectedCountry) {
    return <Navigate to={ROUTES.auth.login} replace />
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <img
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-105 object-cover"
        src={welcomeImage}
      />
      <div className="absolute inset-0 bg-black/60" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <Card tone="elevated"
          className="
             w-full
            max-w-md
          bg-surface/95
           text-text-primary
            backdrop-blur
            ">
          <CardContent className="p-6 text-center sm:p-8">
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-primary text-base font-bold text-white">
              VH
            </div>

            <div className="mt-6">
              <h1 className="text-3xl font-semibold text-text-primary sm:text-4xl">Welcome to ValuationHub</h1>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                Select your operating country to access the Collateral Valuation Management Platform.
              </p>
            </div>

            <form className="mt-8 space-y-5 text-left" onSubmit={handleSubmit(onSubmit)}>
              <Select
                error={errors.country?.message}
                label="Country"
                options={countryOptions}
                placeholder="Select country"
                required
                {...register('country')}
              />

              <Button
                className="w-full cursor-pointer"
                isLoading={isSubmitting}
                rightIcon={<FiArrowRight aria-hidden="true" />}
                type="submit"
              >
                Continue to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}

export default WelcomePage
