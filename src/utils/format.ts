export function formatNumber(n: number): string {
  return n.toLocaleString('en-US')
}

export function formatTrend(n: number): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n}%`
}
