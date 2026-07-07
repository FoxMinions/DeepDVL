<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

import ActivityFeed from '../components/ActivityFeed.vue'
import BasePanel from '../components/BasePanel.vue'
import MetricCard from '../components/MetricCard.vue'
import ScreenHeader from '../components/ScreenHeader.vue'
import DataHubChart from '../charts/DataHubChart.vue'
import LineTrendChart from '../charts/LineTrendChart.vue'
import PieCategoryChart from '../charts/PieCategoryChart.vue'
import BigScreenLayout from '../layouts/BigScreenLayout.vue'
import { useDashboardStore } from '../stores/dashboardStore'

const dashboard = useDashboardStore()
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  void dashboard.loadDashboard()
  timer = setInterval(() => {
    void dashboard.loadDashboard()
  }, 30000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <BigScreenLayout>
    <main class="dashboard-view">
      <ScreenHeader />
      <template v-if="dashboard.data">
        <div
          v-if="dashboard.error"
          class="dashboard-view__banner"
        >
          数据刷新失败，将在 30 秒后重试
        </div>
        <div
          v-if="dashboard.selectedNodeId"
          class="dashboard-view__nodeinfo"
        >
          已选中：{{
            dashboard.data.hubNodes.find(
              (n) => n.id === dashboard.selectedNodeId,
            )?.name || ''
          }}
        </div>
        <div class="dashboard-view__metrics">
          <MetricCard
            v-for="m in dashboard.data.summary"
            :key="m.id"
            :metric="m"
          />
        </div>
        <div class="dashboard-view__grid">
          <div class="dashboard-view__col">
            <BasePanel title="访问趋势">
              <LineTrendChart :data="dashboard.data.trend" />
            </BasePanel>
            <BasePanel title="分类占比">
              <PieCategoryChart :data="dashboard.data.categories" />
            </BasePanel>
          </div>
          <div class="dashboard-view__col dashboard-view__col--center">
            <BasePanel title="DeepDVL 数据中枢">
              <DataHubChart
                v-if="dashboard.data.hubNodes.length"
                :data="dashboard.data.hubNodes"
                @select="dashboard.selectedNodeId = $event"
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
              <ActivityFeed :data="dashboard.data.activities" />
            </BasePanel>
          </div>
        </div>
      </template>
      <section
        v-else
        class="dashboard-view__state"
      >
        <template v-if="dashboard.error">
          {{ dashboard.error }}，将在 30 秒后重试
        </template>
        <template v-else>
          数据加载中...
        </template>
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

.dashboard-view__banner {
  padding: 6px 14px;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--yellow);
  background: rgb(224 184 76 / 12%);
  border: 1px solid rgb(224 184 76 / 26%);
  border-radius: 4px;
  text-align: center;
}

.dashboard-view__nodeinfo {
  padding: 4px 14px;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--primary);
  background: rgb(212 168 83 / 8%);
  border: 1px solid rgb(212 168 83 / 18%);
  border-radius: 4px;
  text-align: center;
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
  margin-top: 14px;
}

.dashboard-view__col {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 14px;
  min-height: 0;
  overflow: hidden;
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
  display: grid;
  place-self: center center;
  flex: 1;
  font-size: 18px;
  color: var(--muted);
}
</style>
