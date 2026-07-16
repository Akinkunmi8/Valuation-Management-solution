export const sanitizeDigits = (
  value: unknown,
) => {

  if (
    value === '' ||
    value === undefined ||
    value === null
  ) {
    return undefined
  }

  return Number(
    String(value).replace(/\D/g, ''),
  )
}