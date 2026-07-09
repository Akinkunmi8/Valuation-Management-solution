import type { CreateFacilityFormValues } from '../schemas/facilitySchemas'

type CustomerLookupResponse = Pick<
  CreateFacilityFormValues,
  | 'customerName'
  | 'city'
  | 'country'
>

const MOCK_CUSTOMERS: Record<
  string,
  CustomerLookupResponse
> = {
  '0123456789': {
    customerName: 'John Doe',
    city: 'Lagos',
    country: 'Nigeria',
  },

  '1111111111': {
    customerName: 'Jane Smith',
    city: 'Ibadan',
    country: 'Nigeria',
  },

  '2222222222': {
    customerName: 'UBA Industries Ltd.',
    city: 'Abuja',
    country: 'Nigeria',
  },
}

export const lookupCustomer = async (
  accountNumber: string,
) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 800),
  )

  return (
    MOCK_CUSTOMERS[accountNumber] ??
    null
  )
}