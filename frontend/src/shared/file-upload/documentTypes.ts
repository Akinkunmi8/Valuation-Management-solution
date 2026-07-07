export const DOCUMENT_TYPES = {
  titleDocument: {
    accept: [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],

    extensions: [
      'PNG',
      'JPG',
      'JPEG',
      'PDF',
      'DOCX',
    ],
  },

  approvalLetter: {
    accept: [
      'image/png',
      'image/jpeg',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],

    extensions: [
      'PNG',
      'JPG',
      'JPEG',
      'PDF',
      'DOCX',
    ],
  },

  indemnityLetter: {
    accept: [
      'image/png',
      'image/jpeg',
      'application/pdf',
    ],

    extensions: [
      'PNG',
      'JPG',
      'JPEG',
      'PDF',
    ],
  },
} as const