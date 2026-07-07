import { useMemo } from 'react'

import { useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../shared/ui/card/Card'

import Input from '../../../shared/ui/input/Input'

import Select from '../../../shared/ui/select/Select'

import {
  STATE_OPTIONS,
  LGA_OPTIONS,
} from '../constants/locationOptions'

import {
  COLLATERAL_TYPE_OPTIONS,
} from '../constants/facilityOptions'



import type {
  CreateFacilityFormValues,
} from '../schemas/facilitySchemas'

const CollateralCard = () => {
  const {
    register,
    watch,
    formState: { errors },
  } =
    useFormContext<CreateFacilityFormValues>()

  const selectedState =
    watch('stateOfCollateral')

  const lgaOptions =
    useMemo(() => {
      if (!selectedState) {
        return []
      }

      return (
        LGA_OPTIONS[
          selectedState as keyof typeof LGA_OPTIONS
        ] ?? []
      )
    }, [selectedState])

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Collateral Information
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Collateral Owner"
            error={
              errors.collateralOwner?.message
            }
            {...register(
              'collateralOwner',
            )}
          />

          <Select
            label="Collateral Type"
            placeholder="Select collateral type"
            options={
              COLLATERAL_TYPE_OPTIONS
            }
            error={
              errors.collateralType?.message
            }
            {...register(
              'collateralType',
            )}
          />

          <Input
            type="number"
            label="Collateral Value"
            error={
              errors.collateralValue?.message
            }
            {...register(
              'collateralValue',
              {
                valueAsNumber: true,
              },
            )}
          />

          <Select
            label="State"
            placeholder="Select State"
            options={STATE_OPTIONS}
            error={
              errors.stateOfCollateral?.message
            }
            {...register(
              'stateOfCollateral',
            )}
          />

          <Select
            label="Local Government"
            placeholder="Select LGA"
            options={lgaOptions}
            {...register(
              'location',
            )}
          />

          <Input
            label="Other Details"
            error={
              errors.otherDetails?.message
            }
            {...register(
              'otherDetails',
            )}
          />

        </div>

      </CardContent>

    </Card>
  )
}

export default CollateralCard