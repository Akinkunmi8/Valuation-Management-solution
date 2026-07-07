export const FACILITY_STATUS_CONFIG = {
  DRAFT: {
    label: 'Draft',
    variant: 'neutral',
  },

  SUBMITTED: {
    label: 'Submitted',
    variant: 'info',
  },

  PAYMENT_PENDING: {
    label: 'Payment Pending',
    variant: 'warning',
  },

  PAID: {
    label: 'Paid',
    variant: 'success',
  },

  CMU_REVIEW: {
    label: 'CMU Review',
    variant: 'info',
  },

  VALUER_ASSIGNED: {
    label: 'Valuer Assigned',
    variant: 'info',
  },

  VALUATION_IN_PROGRESS: {
    label: 'In Progress',
    variant: 'warning',
  },

  REPORT_SUBMITTED: {
    label: 'Report Submitted',
    variant: 'info',
  },

  CMU_REVIEW_REPORT: {
    label: 'Review Report',
    variant: 'warning',
  },

  CMU_HEAD_APPROVED: {
    label: 'Approved',
    variant: 'success',
  },

  COMPLETED: {
    label: 'Completed',
    variant: 'success',
  },

  REJECTED: {
    label: 'Rejected',
    variant: 'danger',
  },
} as const