export const formatDate = (
  value: string,
  locale = 'en-GB',
) => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value))
}