<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <section
    class="base-panel"
    :aria-label="title"
  >
    <header class="base-panel__header">
      <span class="base-panel__mark" />
      <h2 class="base-panel__title">
        {{ title }}
      </h2>
      <slot name="extra" />
    </header>
    <div class="base-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.base-panel {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 14px;
  background:
    linear-gradient(135deg, rgb(212 168 83 / 10%), transparent 38%) var(--panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow:
    inset 0 0 28px rgb(180 140 70 / 6%),
    0 0 24px rgb(212 168 83 / 14%);
}

.base-panel::before,
.base-panel::after {
  position: absolute;
  width: 34px;
  height: 34px;
  pointer-events: none;
  content: '';
}

.base-panel::before {
  top: -1px;
  left: -1px;
  border-top: 2px solid var(--primary);
  border-left: 2px solid var(--primary);
  border-radius: 8px 0 0;
}

.base-panel::after {
  right: -1px;
  bottom: -1px;
  border-right: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  border-radius: 0 0 8px;
}

.base-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.base-panel__mark {
  display: block;
  width: 8px;
  height: 8px;
  background: var(--primary);
  transform: rotate(45deg);
  box-shadow: 0 0 8px var(--primary), 0 0 18px rgb(212 168 83 / 40%);
}

.base-panel__title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--text);
  text-shadow: 0 0 14px rgb(212 168 83 / 22%);
}

.base-panel__body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  margin-top: 10px;
}
</style>
