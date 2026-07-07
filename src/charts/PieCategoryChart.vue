<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { CategoryItem } from '../types/dashboard'
import { observeResize } from '../utils/resize'

const props = defineProps<{
  data: CategoryItem[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const PIE_COLORS = [
  '#d4a853',
  '#c9956b',
  '#e8c97a',
  '#b8944a',
  '#5cb88d',
]

function buildOption(): echarts.EChartsOption {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10, 10, 15, 0.94)',
      borderColor: 'rgba(212, 168, 83, 0.36)',
      borderWidth: 1,
      textStyle: { color: '#f0ede6', fontSize: 12 },
      formatter: '{b}: {c}% ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 4,
      top: 'center',
      textStyle: { color: '#a09888', fontSize: 11 },
      itemWidth: 10,
      itemHeight: 6,
      itemGap: 12,
    },
    series: [
      {
        type: 'pie',
        radius: ['45%', '72%'],
        center: ['38%', '50%'],
        roseType: 'area',
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(10, 10, 15, 0.6)',
          borderWidth: 2,
        },
        label: { show: false },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#f0ede6',
          },
          scaleSize: 8,
        },
        data: props.data.map((item, i) => ({
          ...item,
          itemStyle: { color: PIE_COLORS[i % PIE_COLORS.length] },
        })),
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
    data-testid="pie-category-chart"
  />
</template>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
