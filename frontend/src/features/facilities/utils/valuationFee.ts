export const calculateValuationFee = (
  collateralValue: number,
): number => {
  if (collateralValue <= 10_000_000) return 25_000

  if (collateralValue <= 35_000_000) return 40_000

  if (collateralValue <= 50_000_000) return 65_000

  if (collateralValue <= 150_000_000) return 100_000

  if (collateralValue <= 300_000_000) return 150_000

  if (collateralValue <= 500_000_000) return 200_000

  if (collateralValue <= 1_000_000_000) return 350_000

  if (collateralValue <= 2_000_000_000) return 500_000

  if (collateralValue <= 3_000_000_000) return 750_000

  if (collateralValue <= 5_000_000_000) return 1_000_000

  return 0
}

export const calculateShopFee = (
  numberOfShops: number,
) => {

  if (numberOfShops <= 0) {
    return 0
  }

  return (
    25000 +
    (numberOfShops - 1) * 10000
  )

}