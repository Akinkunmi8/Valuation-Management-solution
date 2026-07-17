import { useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card/Card'

import Input from '@/shared/ui/input/Input'
import Button from '@/shared/ui/button/Button'

import type { CreateFacilityFormValues } from '../schemas/facilitySchemas'
import { lookupCustomer } from '../services/mockCustomerService'
import { DEV_MODE } from '@/app/config/development'
import { useAppSelector } from '@/app/store/hooks'

const CustomerInformationCard = () => {


  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } =
    useFormContext<CreateFacilityFormValues>()

  const [loading, setLoading] = useState(false);
  const solId = useAppSelector(
    (state) => state.auth.solId,
  )

  useEffect(() => {
    if (solId) {
      setValue('solid', solId)
    }
  }, [solId, setValue])

  const handleLookup =
    async () => {
      const accountNumber =
        getValues(
          'accountNumber',
        )
      if (!accountNumber) {
        return
      }
      setLoading(true)
      try {
        const customer =
          await lookupCustomer(accountNumber,)
        if (!customer) {
          alert('Customer not found',)
          return
        }
        setValue('customerName', customer.customerName,)
        setValue('city', customer.city,)
        setValue('country', customer.country,)
      } finally {
        setLoading(false)
      }

    }

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Customer Information
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-5 md:grid-cols-2">

          {/* <Input
            label="Account Number"
            placeholder="Enter account number"
            error={errors.accountNumber?.message}
            {...register('accountNumber')}
          /> */}

          <div className="md:col-span-2">

            <label
              className="
            mb-2
            block
            text-sm
            font-medium
        "
            >
              Account Number
            </label>

            <div className="flex gap-3">

              <Input
                className="flex-1"
                placeholder="Enter account number"
                pattern='[0-9]*'
                error={
                  errors.accountNumber
                    ?.message
                }
                {...register(
                  'accountNumber',
                )}
              />

              <Button
                type="button"
                onClick={
                  handleLookup
                }
                isLoading={
                  loading
                }
              >
                Lookup
              </Button>

            </div>

          </div>

          <Input
            label="Customer Name"
            disabled={!DEV_MODE.mockCustomerLookup}
            error={errors.customerName?.message}
            {...register('customerName')}
          />

          <Input
            label="SOL ID"
            disabled={!DEV_MODE.mockCustomerLookup}
            error={errors.solid?.message}
            {...register('solid')}
          />

          <Input
            label="City"
            disabled={!DEV_MODE.mockCustomerLookup}
            error={errors.city?.message}
            {...register('city')}
          />

          <Input
            label="Country"
            disabled={!DEV_MODE.mockCustomerLookup}
            error={errors.country?.message}
            {...register('country')}
          />

        </div>

      </CardContent>

    </Card>
  )
}

export default CustomerInformationCard