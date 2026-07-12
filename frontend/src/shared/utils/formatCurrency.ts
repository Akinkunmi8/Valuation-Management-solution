export const formatCurrency = (
  amount: number,
  currency = "NGN",
  locale = "en-NG",
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};
