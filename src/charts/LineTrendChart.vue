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
      backgroundColor: 'rgba(10, 10, 15, 0.94)',
      borderColor: 'rgba(212, 168, 83, 0.36)',
      borderWidth: 1,
      textStyle: { color: '#f0ede6' },
      axisPointer: { lineStyle: { color: 'rgba(212, 168, 83, 0.4)' } },
    },
    legend: {
      top: 0,
      right: 8,
      textStyle: { color: '#a09888', fontSize: 12 },
      itemWidth: 12,
      itemHeight: 8,
    },
    xAxis: {
      type: 'category',
      data: props.data.map((p) => p.time),
      boundaryGap: false,
      axisLine: { lineStyle: { color: 'rgba(212, 168, 83, 0.25)' } },
      axisLabel: { color: '#a09888', fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(212, 168, 83, 0.06)' } },
      axisLabel: { color: '#a09888', fontSize: 11 },
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
        lineStyle: { color: '#d4a853', width: 2 },
        itemStyle: { color: '#d4a853' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(212, 168, 83, 0.26)' },
            { offset: 1, color: 'rgba(212, 168, 83, 0.01)' },
          ]),
        },
      },
      {
        name: '订单数',
        type: 'line',
        smooth: true,
        showSymbol: false,
        data: props.data.map((p) => p.orders),
        lineStyle: { color: '#e8c97a', width: 2 },
        itemStyle: { color: '#e8c97a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(232, 201, 122, 0.20)' },
            { offset: 1, color: 'rgba(232, 201, 122, 0.01)' },
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
