<script setup lang="ts">
import { onMounted, ref } from 'vue'

import BasePanel from '../components/BasePanel.vue'
import MetricCard from '../components/MetricCard.vue'
import ScreenHeader from '../components/ScreenHeader.vue'
import DataHubChart from '../charts/DataHubChart.vue'
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
        <div class="dashboard-view__grid">
          <div class="dashboard-view__col">
            <BasePanel title="访问趋势">
              <LineTrendChart :data="data.trend" />
            </BasePanel>
            <BasePanel title="分类占比">
              <div class="dashboard-view__placeholder">
                敬请期待
              </div>
            </BasePanel>
          </div>
          <div class="dashboard-view__col dashboard-view__col--center">
            <BasePanel title="DeepDVL 数据中枢">
              <DataHubChart
                v-if="data.hubNodes.length"
                :data="data.hubNodes"
              />
            </BasePanel>
          </div>
          <div class="dashboard-view__col">
            <BasePanel title="能力雷达">
              <div class="dashboard-view__placeholder">
                敬请期待
              </div>
            </BasePanel>
            <BasePanel title="实时动态">
              <div class="dashboard-view__placeholder">
                敬请期待
              </div>
            </BasePanel>
          </div>
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
  padding: 0 28px 20px;
  color: var(--text);
}

.dashboard-view__body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
  min-height: 0;
}

.dashboard-view__metrics {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  flex-shrink: 0;
}

.dashboard-view__grid {
  display: grid;
  grid-template-columns: 25% 1fr 25%;
  gap: 14px;
  flex: 1;
  min-height: 0;
}

.dashboard-view__col {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 14px;
  min-height: 0;
}

.dashboard-view__col--center {
  grid-template-rows: 1fr;
}

.dashboard-view__placeholder {
  display: grid;
  place-content: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: var(--muted);
}

.dashboard-view__state {
  place-self: center center;
  flex: 1;
  font-size: 18px;
  color: var(--muted);
}
</style>
