<script setup lang="ts">
import type { ActivityItem } from '../types/dashboard'

defineProps<{
  data: ActivityItem[]
}>()

function levelDotClass(level: ActivityItem['level']): string {
  return `activity-feed__dot--${level}`
}
</script>

<template>
  <div
    class="activity-feed"
    data-testid="activity-feed"
  >
    <div class="activity-feed__list">
      <article
        v-for="item in data"
        :key="item.id"
        class="activity-feed__item"
      >
        <span
          class="activity-feed__dot"
          :class="levelDotClass(item.level)"
        />
        <time class="activity-feed__time">{{ item.time }}</time>
        <span class="activity-feed__message">{{ item.message }}</span>
      </article>
    </div>
  </div>
</template>

<style scoped>
.activity-feed {
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(212 168 83 / 20%) transparent;
}

.activity-feed__list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px 0;
}

.activity-feed__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 10px;
  background: rgb(212 168 83 / 4%);
  border-left: 2px solid rgb(212 168 83 / 16%);
  border-radius: 0 4px 4px 0;
  transition: background 0.3s ease;
}

.activity-feed__item:hover {
  background: rgb(212 168 83 / 8%);
}

.activity-feed__dot {
  width: 7px;
  height: 7px;
  margin-top: 4px;
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-feed__dot--info {
  background: var(--muted);
  box-shadow: 0 0 4px var(--muted);
}

.activity-feed__dot--success {
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
}

.activity-feed__dot--warning {
  background: var(--yellow);
  box-shadow: 0 0 6px var(--yellow);
}

.activity-feed__time {
  font-size: 11px;
  color: var(--muted);
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
  min-width: 52px;
}

.activity-feed__message {
  font-size: 12px;
  color: var(--text);
  line-height: 1.5;
}
</style>
