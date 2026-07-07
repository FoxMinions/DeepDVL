<script setup lang="ts"></script>

<template>
  <div class="big-screen-layout">
    <div class="big-screen-layout__canvas">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.big-screen-layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.big-screen-layout__canvas {
  width: min(100vw, calc(100vh * 16 / 9));
  height: min(100vh, calc(100vw * 9 / 16));
  min-width: 1180px;
  min-height: 664px;
  margin: 0 auto;
  overflow: hidden;
}

@media (width <= 1180px) {
  .big-screen-layout__canvas {
    width: 1180px;
    height: 664px;
  }
}
</style>
