<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { TrendPoint } from '../types/dashboard'
import { observeResize } from '../utils/resize'

const props = defineProps<{
  data: TrendPoint[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

function buildOption(): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    grid: { top: 24, right: 24, bottom: 32, left: 44 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(4, 17, 32, 0.92)',
      borderColor: 'rgba(99, 208, 255, 0.36)',
      borderWidth: 1,
      textStyle: { color: '#eaf9ff' },
      axisPointer: { lineStyle: { color: 'rgba(69, 217, 255, 0.4)' } },
    },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: '#91b3ca', fontSize: 12 },
      itemWidth: 12,
      itemHeight: 8,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((p) => p.time),
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(99, 170, 255, 0.3)' } },
      axisLabel: { color: '#91b3ca', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(99, 170, 255, 0.08)' } },
      axisLabel: { color: '#91b3ca', fontSize: 11 },
      axisLine: { show: false },
      axisTick: { show: false },
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: props.data.map((p) => p.visits),
        lineStyle: { color: '#45d9ff', width: 2 },
        itemStyle: { color: '#45d9ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(69, 217, 255, 0.32)' },
            { offset: 1, color: 'rgba(69, 217, 255, 0.02)' },
          ]),
        },
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: props.data.map((p) => p.orders),
        lineStyle: { color: '#7be2ff', width: 2 },
        itemStyle: { color: '#7be2ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(123, 226, 255, 0.24)' },
            { offset: 1, color: 'rgba(123, 226, 255, 0.01)' },
          ]),
        },
      },
    ],
  }
}

function renderChart() {
  if (!chart) return
  chart.setOption(buildOption())
}

onMounted(() => {
  if (!chartRef.value) return
  chart = echarts.init(chartRef.value)
  renderChart()
  resizeObserver = observeResize(chartRef.value, () => chart?.resize())
})

watch(
  () => props.data,
  () => renderChart(),
  { deep: true },
)

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart?.dispose()
  chart = null
  resizeObserver = null
})
</script>

<template>
  <div
    ref="chartRef"
    class="echarts"
    data-testid="line-trend-chart"
  />
</template>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
