<script setup lang="ts">
import { onMounted, ref } from 'vue'

import LineTrendChart from '../charts/LineTrendChart.vue'
import BigScreenLayout from '../layouts/BigScreenLayout.vue'
import { fetchDashboardData } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

// 临时验证：阶段七会替换为 Pinia store 驱动
const data = ref<DashboardData | null>(null)

onMounted(() => {
  fetchDashboardData().then((d) => {
    data.value = d
  })
})
</script>

<template>
  <BigScreenLayout>
    <main class="dashboard-view">
      <section
        v-if="data"
        class="dashboard-view__panel"
      >
        <h2 class="dashboard-view__title">
          访问趋势
        </h2>
        <div class="dashboard-view__chart">
          <LineTrendChart :data="data.trend" />
        </div>
      </section>
      <section
        v-else
        class="dashboard-view__state"
      >
        数据加载中...
      </section>
    </main>
  </BigScreenLayout>
</template>

<style scoped>
.dashboard-view {
  display: grid;
  width: 100%;
  height: 100%;
  padding: 24px;
  color: var(--text);
}

.dashboard-view__panel {
  display: grid;
  grid-template-rows: 32px 1fr;
  gap: 12px;
  width: 60%;
  height: 360px;
  place-self: center center;
  padding: 14px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow:
    inset 0 0 28px rgb(47 117 255 / 10%),
    0 0 24px rgb(69 217 255 / 18%);
}

.dashboard-view__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  text-shadow: 0 0 14px rgb(69 217 255 / 26%);
}

.dashboard-view__chart {
  min-height: 0;
}

.dashboard-view__state {
  place-self: center center;
  font-size: 18px;
  color: var(--muted);
}
</style>
