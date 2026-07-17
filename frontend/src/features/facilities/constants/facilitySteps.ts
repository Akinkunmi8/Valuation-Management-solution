import type { Step } from '@/shared/ui/stepper'

export const FACILITY_STEPS: Step[] = [
  {
    id: 'customer',
    title: 'Customer',
    description: 'Customer information',
  },

  {
    id: 'facility',
    title: 'Facility',
    description: 'Facility details',
  },

  {
    id: 'collateral',
    title: 'Collateral',
    description: 'Collateral information',
  },

  {
    id: 'documents',
    title: 'Documents',
    description: 'Upload documents',
  },
]