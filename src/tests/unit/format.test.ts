import { describe, expect, it } from 'vitest'
import { formatNumber, formatTrend } from '../../utils/format'

describe('formatNumber', () => {
  it('adds thousand separators', () => {
    expect(formatNumber(128936)).toBe('128,936')
  })

  it('handles small numbers without separators', () => {
    expect(formatNumber(42)).toBe('42')
  })

  it('handles 0', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('handles negative numbers', () => {
    expect(formatNumber(-5000)).toBe('-5,000')
  })

  it('handles decimals (toLocaleString default behavior)', () => {
    expect(formatNumber(1234.5)).toBe('1,234.5')
  })
})

describe('formatTrend', () => {
  it('prefixes positive with + and appends %', () => {
    expect(formatTrend(12.6)).toBe('+12.6%')
  })

  it('prefixes negative with - (no double sign) and appends %', () => {
    expect(formatTrend(-3.2)).toBe('-3.2%')
  })

  it('handles 0', () => {
    expect(formatTrend(0)).toBe('+0%')
  })

  it('handles integer trend', () => {
    expect(formatTrend(8)).toBe('+8%')
  })
})
