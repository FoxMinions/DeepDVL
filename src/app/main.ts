import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import { getDataSource } from '../services/dataSource'
import './styles.css'

async function bootstrap() {
  const pinia = createPinia()

  const { worker } = await import('../mocks/browser')
  if (import.meta.env.DEV && getDataSource() === 'mock') {
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  createApp(App).use(pinia).mount('#app')
}

void bootstrap()
