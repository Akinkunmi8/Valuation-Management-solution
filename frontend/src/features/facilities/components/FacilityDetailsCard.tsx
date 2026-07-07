import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../shared/ui/card/Card'

import Input from '../../../shared/ui/input/Input'
import Select from '../../../shared/ui/select/Select'

import { useAppSelector } from '../../../app/store/hooks'

import type { CreateFacilityFormValues } from '../schemas/facilitySchemas'

const facilityPurposeOptions = [
  {
    label: 'Mortgage',
    value: 'Mortgage',
  },
  {
    label: 'Overdraft',
    value: 'Overdraft',
  },
  {
    label: 'Term Loan',
    value: 'Term Loan',
  },
  {
    label: 'Working Capital',
    value: 'Working Capital',
  },
]

const FacilityDetailsCard = () => {
  const {
    register,
    setValue,
    formState: { errors },
  } =
    useFormContext<CreateFacilityFormValues>()

  const {
    fullName,
  } = useAppSelector(
    (state) => state.auth,
  )

  useEffect(() => {
    if (fullName) {
      setValue(
        'createdBy',
        fullName,
      )

      /**
       * Placeholder.
       * Replace with staff number from JWT later.
       */
      setValue(
        'rmsNumber',
        'RM001',
      )
    }
  }, [fullName, setValue])

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Facility Details
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-5 md:grid-cols-2">

          <Select
            label="Facility Purpose"
            placeholder="Select purpose"
            options={
              facilityPurposeOptions
            }
            error={
              errors.facilityPurpose
                ?.message
            }
            {...register(
              'facilityPurpose',
            )}
          />

          <Input
            label="Facility Address"
            error={
              errors.facilityAddress
                ?.message
            }
            {...register(
              'facilityAddress',
            )}
          />

          <Input
            label="RM Number"
            disabled
            {...register(
              'rmsNumber',
            )}
          />

          <Input
            label="Created By"
            disabled
            {...register(
              'createdBy',
            )}
          />

          <Input
            type="number"
            label="Valuation Fee"
            error={
              errors.valuationsFees
                ?.message
            }
            {...register(
              'valuationsFees',
              {
                valueAsNumber: true,
              },
            )}
          />

        </div>

      </CardContent>

    </Card>
  )
}

export default FacilityDetailsCard