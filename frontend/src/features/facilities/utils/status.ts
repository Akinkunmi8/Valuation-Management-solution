
export const APPROVAL_STATUS = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
} as const

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


export const getPaymentStatus = (
  status: number | string,
): StatusConfig => {

  if (typeof status === 'number') {

    return {
      label:
        PAYMENT_STATUS[
          status as keyof typeof PAYMENT_STATUS
        ] ?? 'Unknown',

      variant:
        status === 2
          ? 'success'
          : status === 3
          ? 'danger'
          : status === 4
          ? 'info'
          : 'warning',
    }

  }

  switch (status) {

    case 'Successful':
      return {
        label: status,
        variant: 'success',
      }

    case 'Failed':
      return {
        label: status,
        variant: 'danger',
      }

    case 'Reversed':
      return {
        label: status,
        variant: 'info',
      }

    default:
      return {
        label: status,
        variant: 'warning',
      }

  }

}

  export const getApprovalStatus = (
  status: number | string,
): {
  label: string
  variant: StatusVariant
} => {

  switch (status) {

    case 0:
    case 'Pending':
      return {
        label: 'Pending',
        variant: 'warning',
      }

    case 1:
    case 'Approved':
      return {
        label: 'Approved',
        variant: 'success',
      }

    case 2:
    case 'Rejected':
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

export const getValuationStatus = (
  status: number | string,
) => {

  switch (status) {

    case 0:
    case 'UnAssigned':
      return {
        label: 'Unassigned',
        variant: 'neutral',
      }

    case 1:
    case 'Assigned':
      return {
        label: 'Assigned',
        variant: 'info',
      }

    case 2:
    case 'InProgress':
    case 'In Progress':
      return {
        label: 'In Progress',
        variant: 'warning',
      }

    case 3:
    case 'Completed':
      return {
        label: 'Completed',
        variant: 'success',
      }

    default:
      return {
        label: String(status),
        variant: 'neutral',
      }

  }

}