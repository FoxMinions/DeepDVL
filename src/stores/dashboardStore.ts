import { defineStore } from 'pinia'

import { logger } from '../logs/logger'
import { fetchDashboardData } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    data: null as DashboardData | null,
    loading: false,
    error: null as string | null,
    selectedNodeId: null as string | null,
  }),
  actions: {
    async loadDashboard() {
      this.loading = true
      this.error = null
      try {
        this.data = await fetchDashboardData()
        logger.info('Dashboard data loaded', this.data.updatedAt)
      } catch (e) {
        this.error = '数据加载失败'
        logger.error('Dashboard load failed', e)
      } finally {
        this.loading = false
      }
    },
  },
})
