# 04 · 阶段四：第一个图表与 ECharts 封装

## 本阶段目标

封装出**第一个可复用的图表组件**——访问趋势折线图 `LineTrendChart.vue`，并建立「ECharts + Vue」的标准封装范式（init / setOption / resize / dispose）和 `observeResize` 工具。顺带把日志系统 `logger.ts` 建起来。本阶段结束时，页面上出现第一张图表，且窗口缩放时图表能跟着 resize。

## 前置依赖

- 阶段三已完成：数据层就绪，`fetchDashboardData()` 能取到 `trend: TrendPoint[]`。
- 已安装 `echarts`（阶段三提示词允许预装；若没装，本阶段装）。

## 为什么这么做

**ECharts 在 Vue 里的封装是个「坑点」**，新手常踩三个雷：

1. **不 resize**：容器变大变小，图表不跟着变，停在初始尺寸。根因是 ECharts 实例不会自动监听容器变化。
2. **内存泄漏**：组件卸载没调 `chart.dispose()`，实例残留在内存里，切来切去页面越来越卡。
3. **重复 init**：用 `watch` 监听数据变化时粗暴地重新 `echarts.init`，导致 canvas 叠影。

**正确范式**：
- `onMounted` 时 `init` 一次，拿到实例存起来；
- 数据变化时只调 `chart.setOption(newOption)`，**不重新 init**；
- 用 `ResizeObserver` 监听容器，触发 `chart.resize()`；
- `onBeforeUnmount` 调 `chart.dispose()` 并断开 observer。

`utils/resize.ts` 把 `ResizeObserver` 包成 `observeResize(target, callback)` 复用，所有图表共用。

**为什么现在就建 logger**：图表组件里会有「数据为空」「setOption 失败」等需要记录的情况，趁早建好 logger，后面所有组件统一用它，而不是散落各处的 `console.log`。

**教学要点**：理解 ECharts 是**命令式**库，而 Vue 是**声明式**框架——封装的本质是「用 Vue 的生命周期管理 ECharts 实例的生灭」。这是图表组件的核心心智模型。

## 要落地的产物

- `src/utils/resize.ts`：`observeResize(target, callback): ResizeObserver`，内部 `new ResizeObserver(() => callback()).observe(target)`，返回 observer 供调用方卸载时断开。
- `src/logs/logger.ts`：`logger` 支持 `info / warn / error / debug`，开发环境输出到 console（带级别前缀），结构上预留「后续接 Sentry/日志平台」的扩展点（如 `transport` 接口）。
- `src/charts/LineTrendChart.vue`：接收 `data: TrendPoint[]`，渲染双线折线图（visits + orders）。严格按封装范式：init 一次、setOption 更新、observeResize、dispose。深空配色（线条青蓝/冰蓝，坐标轴/文字用 `--muted`，tooltip 深底青字）。
- `src/views/DashboardView.vue`：临时调用 `fetchDashboardData()` 取数据，把 `trend` 喂给 `LineTrendChart` 验证（后续阶段会换成 store 驱动）。
- 安装 `echarts`（若未装）、`pinia`（本阶段不用但后续要，可预装）。

## 执行提示词

```
你是一个资深前端工程师和 ECharts 可视化专家。

请帮我在现有 Vue 3 + TS 大屏工程里封装第一个图表组件，并建立日志系统。请直接执行，不要只给方案。

项目名 DeepDVL，视觉主题「深空数据宇宙」，色板见项目 docs/提示词/00-项目总览与使用说明.md 的视觉基线（青蓝 #45d9ff 主、冰蓝 #7be2ff 次、靛紫 #6f7bff 点缀；文字 #eaf9ff / #91b3ca）。

要求：
1. 新建 src/utils/resize.ts：
   export function observeResize(target: HTMLElement, callback: () => void): ResizeObserver {
     const observer = new ResizeObserver(() => callback())
     observer.observe(target)
     return observer
   }
2. 新建 src/logs/logger.ts：导出 logger 对象，支持 info/warn/error/debug 四个方法。开发环境（import.meta.env.DEV）输出到 console，带 [level] 前缀。结构上预留接入外部日志平台的能力（例如一个可替换的 transport 数组，每条日志遍历 transport 调用），但本阶段只实现 console transport。
3. 新建 src/charts/LineTrendChart.vue，接收 props { data: TrendPoint[] }（TrendPoint 来自 types/dashboard）。严格按封装范式：
   - ref 拿容器 DOM，chartRef。
   - onMounted：chart = echarts.init(chartRef.value)；renderChart()。
   - watch(() => props.data, renderChart, { deep: true })，renderChart 内部调 chart.setOption(option)，绝不重新 init。
   - observeResize(chartRef.value, () => chart?.resize())，把返回的 observer 存起来。
   - onBeforeUnmount：observer.disconnect()、chart?.dispose()。
   - 折线图：两条线 visits（青蓝 #45d9ff）、orders（冰蓝 #7be2ff）；x 轴 time，y 轴隐藏刻度线、splitLine 用 rgba(99,170,255,0.08)；axisLabel/ticket 文字色 #91b3ca；tooltip 深底 rgba(4,17,32,0.92) + 青蓝边框 rgba(99,208,255,0.36) + 文字 #eaf9ff；series 平滑曲线 smooth:true，areaStyle 半透明渐变。
   - 容器 div class="echarts" data-testid="line-trend-chart"，宽高 100%。
4. 改 src/views/DashboardView.vue：临时 onMounted 调 fetchDashboardData()，把返回的 trend 喂给 LineTrendChart（用 ref 存 data，v-if 防空）。本阶段是临时验证，后续阶段会换成 Pinia store 驱动。
5. 不要在组件里直接 import dashboardMock——数据仍走 services 层。
6. 安装 echarts（若尚未安装），版本下限 ^5.5。
7. 颜色尽量从 CSS 变量读取（可在 JS 里 getComputedStyle 取，或直接用十六进制但与基线一致）。

验证（必须全部通过）：
- npm run build / lint 全绿
- npm run dev：折线图正常渲染，两条线、tooltip、深空配色
- 拖动浏览器窗口改变大小：图表跟着 resize，不变形、不超出容器
- 切换路由或刷新无 canvas 叠影、无控制台报错
- logger.info('test') 在控制台输出带前缀

完成后告诉我：封装范式的四个步骤（init/setOption/resize/dispose）各对应哪段代码、为什么 watch 数据时不能重新 init、已运行的验证及结果。
```

## 验收清单

- [ ] `utils/resize.ts` 的 `observeResize` 实现正确
- [ ] `logs/logger.ts` 支持四级方法，带前缀输出，预留 transport 扩展
- [ ] `LineTrendChart.vue` 严格遵循 init/watch-setOption/observeResize/dispose 范式
- [ ] 图表 `watch` 数据时**不重新 init**，只 `setOption`
- [ ] `onBeforeUnmount` 调了 `dispose()` 和 `observer.disconnect()`
- [ ] 折线图深空配色正确（青蓝/冰蓝双线、深底 tooltip）
- [ ] 拖动窗口图表正确 resize
- [ ] 组件不直接 import mock 数据
- [ ] `npm run build` / `lint` 全绿，控制台无报错

## 思考题 / 进阶

1. 为什么 `watch` 监听数据时调 `setOption` 而不是 `init`？（提示：setOption 内部做 diff，性能好且无叠影）
2. `ResizeObserver` 比监听 `window.resize` 好在哪？（提示：容器大小变化不一定来自窗口 resize，比如侧栏折叠）
3. 如果数据量很大（1000+ 点），折线图会卡——有哪些优化手段？（提示：`sampling`、`large`、数据降采样）
4. 进阶：给 `observeResize` 加节流（`requestAnimationFrame` 或 `lodash.throttle`），想想为什么 resize 回调会被高频触发。

---

← [03 · 数据层](./03-阶段三-数据层与mock-service分层.md) ｜ 下一步 → [05 · 核心指标卡片与通用组件](./05-阶段五-核心指标卡片与通用组件.md)
