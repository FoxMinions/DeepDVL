import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { getDataSource } from '../services/dataSource'
import './styles.css'

async function bootstrap() {
  const pinia = createPinia()

  if (import.meta.env.DEV && getDataSource() === 'mock') {
    try {
      const { worker } = await import('../mocks/browser')
      await worker.start({ onUnhandledRequest: 'bypass' })
    } catch {
      // MSW 启动失败（如 Service Worker 未注册）不影响应用挂载
      console.warn('[DeepDVL] MSW worker failed to start, falling back to direct mock')
    }
  }

  createApp(App).use(pinia).mount('#app')
}

void bootstrap()
