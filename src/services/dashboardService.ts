import { dashboardMock } from '../mocks/dashboardMock'
import type { DashboardData } from '../types/dashboard'
import { getDataSource } from './dataSource'
import { httpClient } from './http'

export async function fetchDashboardData(): Promise<DashboardData> {
  if (getDataSource() === 'mock') {
    return Promise.resolve({
      ...dashboardMock,
      updatedAt: new Date().toISOString(),
    })
  }

  const response = await httpClient.get<DashboardData>('/dashboard')
  return response.data
}
