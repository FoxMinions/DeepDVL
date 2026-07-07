import { http, HttpResponse } from 'msw'

import { dashboardMock } from './dashboardMock'

export const handlers = [
  http.get('/api/dashboard', () => {
    return HttpResponse.json({
      ...dashboardMock,
      updatedAt: new Date().toISOString(),
    })
  }),
]
