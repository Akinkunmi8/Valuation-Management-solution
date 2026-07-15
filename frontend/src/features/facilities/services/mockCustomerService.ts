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
    customerName: 'Aderemi Abiodun',
    city: 'Lagos',
    country: 'Nigeria',
  },

  '1111111111': {
    customerName: 'Adeola Ogunwuyi',
    city: 'Ibadan',
    country: 'Nigeria',
  },

  '2222222222': {
    customerName: 'Olawale Akin',
    city: 'Abuja',
    country: 'Nigeria',
  },
  '3333333333': {
    customerName: 'Okin Folusho',
    city: 'Ibadan',
    country: 'Nigeria',
  },
  '4444444444': {
    customerName: 'Ramat Iyiola',
    city: 'Lagos',
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