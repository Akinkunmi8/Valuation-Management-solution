import { useMemo, useEffect } from 'react'
import { calculateShopFee, calculateValuationFee } from '../utils/valuationFee'

import { useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card/Card'

import Input from '@/shared/ui/input/Input'

import Select from '@/shared/ui/select/Select'

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
    setValue,
    formState: { errors },
  } =
    useFormContext<CreateFacilityFormValues>()


  const collateralType = watch('collateralType')

  const numberOfShops = watch('numberOfShops')

  const collateralValue = watch('collateralValue')

  useEffect(() => {

    // Nothing selected yet
    if (!collateralType) {

      setValue('valuationsFees', 0)

      return
    }

    // Shop
    if (collateralType === 'Shop') {

      setValue('collateralValue', 0)

      if (!numberOfShops || numberOfShops <= 0) {

        setValue('valuationsFees', 0)

        return
      }

      setValue(
        'valuationsFees',
        calculateShopFee(numberOfShops),
      )

      return
    }

    // Every other collateral

    if (!collateralValue || collateralValue <= 0) {

      setValue('valuationsFees', 0)

      return
    }

    setValue(
      'valuationsFees',
      calculateValuationFee(collateralValue),
    )

  }, [
    collateralType,
    collateralValue,
    numberOfShops,
    setValue,
  ])

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

          {
            collateralType === 'Shop' && (
              <Input
                label="Number of Shops"
                type="number"
                pattern='[0-9]*'
                {...register(
                  'numberOfShops',
                  {
                    valueAsNumber: true,
                    setValueAs: value =>
                      value === "" ?
                        undefined :
                        Number(String(value).replace(
                          /\D/g, ''
                        ))
                    ,
                  },
                )}
              />

            )
          }


          <Input
            label="Collateral Value"
            inputMode='numeric'
            pattern='[0-9]*'
            disabled={
              collateralType === 'Shop'
            }
            placeholder={
              collateralType === 'Shop'
                ? 'Not applicable for Shop'
                : 'Enter collateral value'
            }

            {...register(
              'collateralValue',
              {
                valueAsNumber: true,
              },
            )}
          />

          <Input
            // type="number"
            label="Valuation Fee"
            disabled
            pattern='[0-9]*'
            // readOnly
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