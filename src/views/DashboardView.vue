<script setup lang="ts">
import BigScreenLayout from '../layouts/BigScreenLayout.vue'
</script>

<template>
  <BigScreenLayout>
    <main class="dashboard-view">
      <div class="dashboard-view__placeholder">
        布局骨架就绪 · 16:9 自适应
      </div>
    </main>
  </BigScreenLayout>
</template>

<style scoped>
.dashboard-view {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  color: var(--text);
}

.dashboard-view__placeholder {
  padding: 18px 32px;
  font-size: 18px;
  font-weight: 600;
  color: var(--cyan);
  letter-spacing: 2px;
  text-shadow: 0 0 18px rgb(69 217 255 / 45%);
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--panel);
  box-shadow:
    inset 0 0 28px rgb(47 117 255 / 10%),
    0 0 24px rgb(69 217 255 / 18%);
}
</style>
