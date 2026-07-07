<script setup lang="ts">
import type { SummaryMetric } from '../types/dashboard'
import { formatNumber, formatTrend } from '../utils/format'

defineProps<{
  metric: SummaryMetric
}>()

function statusColor(status: SummaryMetric['status']): string {
  return `var(--${status === 'danger' ? 'red' : status === 'warning' ? 'yellow' : 'green'})`
}
</script>

<template>
  <article
    class="metric-card"
    :data-testid="'metric-card'"
    :style="{ '--status-color': statusColor(metric.status) }"
  >
    <span class="metric-card__label">{{ metric.label }}</span>
    <div class="metric-card__value">
      <span class="metric-card__number">{{ formatNumber(metric.value) }}</span>
      <span
        v-if="metric.unit"
        class="metric-card__unit"
      >{{ metric.unit }}</span>
    </div>
    <div
      class="metric-card__trend"
      :class="metric.trend >= 0 ? 'metric-card__trend--up' : 'metric-card__trend--down'"
    >
      {{ metric.trend >= 0 ? '↑' : '↓' }}
      {{ formatTrend(Math.abs(metric.trend)) }}
    </div>
  </article>
</template>

<style scoped>
.metric-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;
  padding: 14px 16px 14px 18px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow:
    inset 0 0 20px rgb(180 140 70 / 5%),
    0 0 16px rgb(212 168 83 / 10%);
}

.metric-card::before {
  position: absolute;
  top: 8px;
  bottom: 8px;
  left: 0;
  width: 3px;
  background: var(--status-color);
  border-radius: 0 2px 2px 0;
  content: '';
}

.metric-card__label {
  font-size: 12px;
  color: var(--muted);
}

.metric-card__value {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.metric-card__number {
  font-size: 28px;
  font-weight: 700;
  color: var(--text);
  text-shadow: 0 0 14px rgb(212 168 83 / 16%);
  line-height: 1;
}

.metric-card__unit {
  font-size: 13px;
  color: var(--muted);
}

.metric-card__trend {
  font-size: 13px;
  font-weight: 600;
}

.metric-card__trend--up {
  color: var(--green);
}

.metric-card__trend--down {
  color: var(--red);
}
</style>
