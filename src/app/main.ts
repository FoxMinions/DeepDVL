import { createApp } from 'vue'

import App from './App.vue'
import { fetchDashboardData } from '../services/dashboardService'
import { getDataSource } from '../services/dataSource'
import './styles.css'

async function bootstrap() {
  // 开发模式启动 MSW mock 拦截；生产模式直接挂载
  const { worker } = await import('../mocks/browser')
  if (import.meta.env.DEV && getDataSource() === 'mock') {
    await worker.start({ onUnhandledRequest: 'bypass' })
    // 临时验证数据层（阶段四会移入组件，由 store 驱动）
    fetchDashboardData().then((data) => {
      console.log('[DeepDVL] dashboard data loaded:', data)
    })
  }

  createApp(App).mount('#app')
}

void bootstrap()
