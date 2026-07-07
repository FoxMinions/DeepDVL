<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const now = ref(new Date())
let timer: ReturnType<typeof setInterval> | null = null

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function formatted(): string {
  const d = now.value
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>

<template>
  <header class="screen-header">
    <div class="screen-header__left">
      <span class="screen-header__line screen-header__line--left" />
    </div>
    <h1 class="screen-header__title">
      DeepDVL · 深度数界实验室
    </h1>
    <div class="screen-header__right">
      <span class="screen-header__line screen-header__line--right" />
      <time class="screen-header__time">{{ formatted() }}</time>
    </div>
  </header>
</template>

<style scoped>
.screen-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 86px;
  padding: 0 28px;
  flex-shrink: 0;
}

.screen-header__left,
.screen-header__right {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.screen-header__right {
  justify-content: flex-end;
}

.screen-header__line {
  height: 1px;
  flex: 1;
}

.screen-header__line--left {
  background: linear-gradient(to right, transparent, rgb(212 168 83 / 40%));
}

.screen-header__line--right {
  background: linear-gradient(to left, transparent, rgb(212 168 83 / 40%));
}

.screen-header__title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
  text-shadow: 0 0 28px rgb(212 168 83 / 30%), 0 0 60px rgb(201 149 107 / 16%);
  letter-spacing: 2px;
  white-space: nowrap;
}

.screen-header__time {
  font-size: 14px;
  color: var(--primary-light);
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
}
</style>
