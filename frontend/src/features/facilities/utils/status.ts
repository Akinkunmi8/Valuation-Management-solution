

export const VALUATION_STATUS = {
  0: 'Unassigned',
  1: 'Assigned',
  2: 'In Progress',
  3: 'Completed',
} as const


export const PAYMENT_STATUS = {
  0: 'Unprocessed',
  1: 'Processing',
  2: 'Successful',
  3: 'Failed',
  4: 'Reversed',
} as const

export const REPORT_STATUS = {
  0: 'Not Started',
  1: 'In Progress',
  2: 'Submitted',
  3: 'Approved',
  4: 'Rejected',
} as const

export type StatusVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

export type StatusConfig = {
  label: string
  variant: StatusVariant
}


export const getApprovalStatus = (
  status: number,
): StatusConfig => {

  switch (status) {

    case 0:

      return {
        label: 'Pending',
        variant: 'warning',
      }

    case 1:

      return {
        label: 'Approved',
        variant: 'success',
      }

    case 2:

      return {
        label: 'Rejected',
        variant: 'danger',
      }

    default:

      return {
        label: 'Unknown',
        variant: 'neutral',
      }

  }

}