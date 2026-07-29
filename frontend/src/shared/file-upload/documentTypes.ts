const PDF_ONLY = {
  accept: ['application/pdf'],
  extensions: ['PDF'],
} as const

export const DOCUMENT_TYPES = {
  titleDocument: PDF_ONLY,
  approvalLetter: PDF_ONLY,
  indemnityLetter: PDF_ONLY,
  valuationReport: PDF_ONLY,
} as const