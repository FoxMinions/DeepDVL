<script setup lang="ts">
import { onMounted, ref } from 'vue'

import BasePanel from '../components/BasePanel.vue'
import MetricCard from '../components/MetricCard.vue'
import ScreenHeader from '../components/ScreenHeader.vue'
import LineTrendChart from '../charts/LineTrendChart.vue'
import BigScreenLayout from '../layouts/BigScreenLayout.vue'
import { fetchDashboardData } from '../services/dashboardService'
import type { DashboardData } from '../types/dashboard'

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
      <ScreenHeader />
      <section
        v-if="data"
        class="dashboard-view__body"
      >
        <div class="dashboard-view__metrics">
          <MetricCard
            v-for="m in data.summary"
            :key="m.id"
            :metric="m"
          />
        </div>
        <div class="dashboard-view__charts">
          <BasePanel title="访问趋势">
            <LineTrendChart :data="data.trend" />
          </BasePanel>
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0 28px 24px;
  color: var(--text);
}

.dashboard-view__body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.dashboard-view__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  flex-shrink: 0;
}

.dashboard-view__charts {
  flex: 1;
  min-height: 0;
}

.dashboard-view__state {
  place-self: center center;
  flex: 1;
  font-size: 18px;
  color: var(--muted);
}
</style>
