import { useFormContext } from 'react-hook-form'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../shared/ui/card/Card'

import Input from '../../../shared/ui/input/Input'

import type { CreateFacilityFormValues } from '../schemas/facilitySchemas'

const CustomerInformationCard = () => {
  const {
    register,
    formState: { errors },
  } =
    useFormContext<CreateFacilityFormValues>()

  return (
    <Card>

      <CardHeader>

        <CardTitle>
          Customer Information
        </CardTitle>

      </CardHeader>

      <CardContent>

        <div className="grid gap-5 md:grid-cols-2">

          <Input
            label="Account Number"
            placeholder="Enter account number"
            error={errors.accountNumber?.message}
            {...register('accountNumber')}
          />

          <Input
            label="Customer Name"
            disabled
            error={errors.customerName?.message}
            {...register('customerName')}
          />

          <Input
            label="SOL ID"
            disabled
            error={errors.solid?.message}
            {...register('solid')}
          />

          <Input
            label="City"
            disabled
            error={errors.city?.message}
            {...register('city')}
          />

          <Input
            label="Country"
            disabled
            error={errors.country?.message}
            {...register('country')}
          />

        </div>

      </CardContent>

    </Card>
  )
}

export default CustomerInformationCard