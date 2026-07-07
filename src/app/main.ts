import { createApp } from 'vue'

import App from './App.vue'
import { getDataSource } from '../services/dataSource'
import './styles.css'

async function bootstrap() {
  // 开发模式且数据源为 mock 时启动 MSW 拦截；生产模式或 api 模式直接挂载
  const { worker } = await import('../mocks/browser')
  if (import.meta.env.DEV && getDataSource() === 'mock') {
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createApp(App).mount('#app')
}

void bootstrap()
