import { describe, expect, it, vi } from 'vitest'

// Stub env before importing the module under test
vi.stubEnv('VITE_DATA_SOURCE', '')

describe('getDataSource', () => {
  it('returns "mock" when VITE_DATA_SOURCE is unset', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', '')
    const { getDataSource } = await import('../../services/dataSource')
    expect(getDataSource()).toBe('mock')
  })

  it('returns "mock" when VITE_DATA_SOURCE is "mock"', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'mock')
    const { getDataSource } = await import('../../services/dataSource')
    expect(getDataSource()).toBe('mock')
  })

  it('returns "api" when VITE_DATA_SOURCE is "api"', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'api')
    const { getDataSource } = await import('../../services/dataSource')
    expect(getDataSource()).toBe('api')
  })
})
