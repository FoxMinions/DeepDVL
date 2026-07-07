import { describe, expect, it, vi } from 'vitest'

vi.stubEnv('VITE_API_BASE_URL', '')
vi.stubEnv('VITE_DATA_SOURCE', 'mock')

describe('fetchDashboardData', () => {
  it('returns DashboardData in mock mode', async () => {
    const { fetchDashboardData } = await import('../../services/dashboardService')
    const data = await fetchDashboardData()

    expect(data).toBeDefined()
    expect(data.summary).toBeDefined()
    expect(data.summary.length).toBe(4)
    expect(data.trend).toBeDefined()
    expect(data.updatedAt).toBeDefined()
    expect(typeof data.summary[0].value).toBe('number')
    expect(typeof data.summary[0].label).toBe('string')
  })

  it('calls http.get when data source is api', async () => {
    vi.stubEnv('VITE_DATA_SOURCE', 'api')

    const httpMod = await import('../../services/http')
    const spy = vi.spyOn(httpMod.http, 'get').mockResolvedValue({
      data: { summary: [], trend: [], updatedAt: new Date().toISOString() },
    } as never)

    const { fetchDashboardData } = await import('../../services/dashboardService')
    const result = await fetchDashboardData()

    expect(spy).toHaveBeenCalledWith('/dashboard')
    expect(result).toBeDefined()
    spy.mockRestore()
  })
})
