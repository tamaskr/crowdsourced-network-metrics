// Converts the given distance parameter (in meters) to a decimal degree number
export const convertToDecimalDegrees = (meters: number): number => {
  // The correct amount is calculated according to this table:
  // http://wiki.gis.com/wiki/index.php/Decimal_degrees
  const result = meters / 111000
  return Number(result.toFixed(6))
}
