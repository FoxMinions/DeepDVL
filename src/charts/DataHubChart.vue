<script setup lang="ts">
import * as echarts from 'echarts'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import type { HubNode } from '../types/dashboard'
import { observeResize } from '../utils/resize'

const props = defineProps<{
  data: HubNode[]
}>()

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

const CENTER: [number, number] = [50, 50]

const STATUS_COLOR: Record<string, string> = {
  good: '#56f0c0',
  warning: '#f4c96b',
  danger: '#ff6b7a',
}

function ringCoords(radius: number, sides: number): [number, number][] {
  const points: [number, number][] = []
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
    points.push([CENTER[0] + radius * Math.cos(angle), CENTER[1] + radius * Math.sin(angle)])
  }
  points.push(points[0])
  return points
}

function buildOption(): echarts.EChartsOption {
  const outerRing = ringCoords(38, 32)
  const innerRing = ringCoords(26, 24)

  const flowLines = props.data.map((n) => ({ coords: [CENTER, n.coord] }))

  const centerPoint: HubNode = {
    id: 'hub',
    name: 'DeepDVL 数据中枢',
    value: 100,
    coord: CENTER,
    status: 'good',
    description: '全平台数据统一调度与监控中心',
  }

  const allNodes = [centerPoint, ...props.data]

  return {
    backgroundColor: 'transparent',
    xAxis: { min: 0, max: 100, show: false },
    yAxis: { min: 0, max: 100, show: false },
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(4, 17, 32, 0.92)',
      borderColor: 'rgba(99, 208, 255, 0.36)',
      borderWidth: 1,
      textStyle: { color: '#eaf9ff', fontSize: 12 },
      formatter: (p: unknown) => {
        const item = p as { name: string }
        const found = allNodes.find(
          (n) => n.name === item.name,
        )
        if (!found) return item.name
        return `<b>${found.name}</b><br/>活跃度：${found.value}<br/>${found.description}`
      },
    },
    series: [
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        polyline: true,
        data: [{ coords: outerRing }],
        silent: true,
        z: 1,
        lineStyle: {
          color: 'rgba(123, 226, 255, 0.12)',
          width: 1,
          type: 'dashed',
        },
        effect: { show: false },
      },
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        polyline: true,
        data: [{ coords: innerRing }],
        silent: true,
        z: 1,
        lineStyle: {
          color: 'rgba(111, 123, 255, 0.10)',
          width: 1,
          type: 'dashed',
        },
        effect: { show: false },
      },
      {
        type: 'lines',
        coordinateSystem: 'cartesian2d',
        data: flowLines,
        z: 2,
        lineStyle: {
          color: 'rgba(69, 217, 255, 0.35)',
          width: 1.5,
          curveness: 0.15,
        },
        effect: {
          show: true,
          period: 4,
          trailLength: 0.3,
          symbol: 'circle',
          symbolSize: 4,
          color: 'rgba(69, 217, 255, 0.7)',
        },
      },
      {
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: props.data.map((n) => ({
          name: n.name,
          value: n.coord,
          symbolSize: Math.max(18, n.value / 2.8),
          itemStyle: {
            color: STATUS_COLOR[n.status] || '#56f0c0',
            shadowBlur: 18,
            shadowColor: STATUS_COLOR[n.status] || '#56f0c0',
          },
        })),
        z: 4,
        rippleEffect: {
          brushType: 'stroke',
          scale: 3.2,
          period: 4,
          color: 'rgba(69, 217, 255, 0.18)',
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          color: '#91b3ca',
          fontSize: 11,
          distance: 6,
        },
      },
      {
        type: 'scatter',
        coordinateSystem: 'cartesian2d',
        data: [
          {
            name: centerPoint.name,
            value: CENTER,
            symbolSize: 40,
            itemStyle: {
              color: '#45d9ff',
              shadowBlur: 32,
              shadowColor: '#45d9ff',
            },
          },
        ],
        z: 5,
        label: {
          show: true,
          position: 'bottom',
          distance: 14,
          formatter: '{b}',
          color: '#eaf9ff',
          fontSize: 13,
          fontWeight: 'bold',
          textShadowColor: 'rgba(69, 217, 255, 0.4)',
          textShadowBlur: 8,
        },
        symbol: 'circle',
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
    data-testid="data-hub-chart"
  />
</template>

<style scoped>
.echarts {
  width: 100%;
  height: 100%;
  min-height: 0;
}
</style>
