export function formatNumber(value: number) {
  return (value > 0 ? '+' : value < 0 ? '-' : '') + String(Math.abs(value))
}
