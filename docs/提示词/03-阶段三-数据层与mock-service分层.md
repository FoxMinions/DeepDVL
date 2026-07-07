# 03 · 阶段三：数据层与 mock/service 分层

## 本阶段目标

建好大屏的**数据骨架**：定义数据类型、用 MSW 做 mock、用 services 层统一访问，并实现 `VITE_DATA_SOURCE` 在 mock/api 之间平滑切换。本阶段结束时，页面还看不到图表，但数据已经能「取到了」——你可以临时在 DashboardView 里打印数据验证。

## 前置依赖

- 阶段二已完成：16:9 布局骨架与深空背景就绪。

## 为什么这么做

**这是整个项目最关键的架构决策之一。**

新手做数据大屏最常见的反模式：**组件里直接 `import { mockData } from './mock'`**。这样写很省事，但有三个致命问题：
1. 后端接口来了，要改几十个组件的 import——无法平滑切换。
2. mock 数据是静态对象，模拟不出「异步请求」「加载中」「请求失败」的真实状态。
3. 组件和数据来源耦合死，没法测试「数据加载失败」的降级 UI。

**正确做法是分层**：
- `types/` 定义数据形状（TypeScript 接口）
- `mocks/` 用 MSW 拦截 HTTP 请求返回模拟数据（**模拟真实的网络请求**，不是直接 import）
- `services/` 是唯一的数据入口：组件只调 `fetchDashboardData()`，它内部决定走 mock 还是 api
- `dataSource.ts` 读环境变量 `VITE_DATA_SOURCE`，`mock` 用本地数据，`api` 用 Axios 打真实接口

这样切换后端只改一个环境变量，组件一行不用动。而且因为 mock 走的是 HTTP 拦截，加载/失败状态都能真实模拟。

**教学要点**：理解「**依赖倒置**」——组件依赖 service 的接口，不依赖具体数据来源。这是从「写 demo」到「写工程」的分水岭。

## 要落地的产物

- `src/types/dashboard.ts`：定义全部数据接口（见下方提示词）。
- `src/mocks/dashboardMock.ts`：导出 `dashboardMock: DashboardData`（一份完整模拟数据）。
- `src/mocks/handlers.ts`：MSW handlers，拦截 `GET /dashboard` 返回 mock。
- `src/mocks/browser.ts`：MSW worker 初始化。
- `public/mockServiceWorker.js`：MSW 必需文件（`msw init public/` 生成，**应提交**）。
- `src/services/http.ts`：Axios 实例（`baseURL` 读 `VITE_API_BASE_URL || '/api'`，`timeout: 8000`）。
- `src/services/dataSource.ts`：`getDataSource(): 'mock' | 'api'`，读 `VITE_DATA_SOURCE`。
- `src/services/dashboardService.ts`：`fetchDashboardData()`——mock 模式返回 `dashboardMock`，api 模式走 `httpClient.get('/dashboard')`。
- `src/app/main.ts`：开发模式下启动 MSW worker。
- `.env`（可选，默认 mock）：`VITE_DATA_SOURCE=mock`。
- 安装依赖：`echarts`、`pinia`、`axios`、`msw`（本阶段先装这些，ECharts/Pinia 在后续阶段才真正用上，但 axios/msw 现在就要）。

> 注：`echarts`、`pinia` 此阶段可只安装不使用（后续阶段会用），避免来回装。若你想严格「按需」，也可只装 `axios`+`msw`，echarts/pinia 留到对应阶段。

## 执行提示词

```
你是一个资深前端工程师和数据大屏架构师。

请帮我在现有 Vue 3 + TS 大屏工程里建立数据层与 mock/service 分层。请直接执行，不要只给方案。

项目名 DeepDVL。本阶段只做数据层，不画任何图表/卡片组件。

要求：
1. 新建 src/types/dashboard.ts，定义以下接口（字段用驼峰）：
   - SummaryMetric { id, label, value, unit, trend, status: 'good'|'warning'|'danger' }
   - TrendPoint { time, visits, orders }
   - CategoryItem { name, value }
   - RankingItem { city, value }
   - RadarIndicator { name, max }；RadarData { indicators: RadarIndicator[], values: number[] }
   - ActivityItem { id, time, level: 'info'|'warning'|'success', message }
   - HubNode { id, name, value, coord: [number, number], status: 'good'|'warning'|'danger', description }
   - DashboardData { updatedAt, summary: SummaryMetric[], trend: TrendPoint[], categories: CategoryItem[], ranking: RankingItem[], radar: RadarData, activities: ActivityItem[], hubNodes: HubNode[] }
2. 新建 src/mocks/dashboardMock.ts：导出一份完整的 dashboardMock，数据要合理（4 条 summary、8 个 trend 点、5 个 categories、6 个 ranking、4 个 radar indicators、6 条 activities、8 个 hubNodes 环绕中心）。hubNodes 用 0-100 抽象坐标环绕 [50,50]，不要写经纬度。
3. 安装 msw 与 axios。用 `msw init public/ --save` 生成 public/mockServiceWorker.js（此文件应提交，不要忽略）。
4. 新建 src/mocks/handlers.ts：MSW handler 拦截 GET /dashboard，返回 200 + dashboardMock。
5. 新建 src/mocks/browser.ts：导出 setupWorker(handlers)。
6. 新建 src/services/http.ts：axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || '/api', timeout: 8000 })，导出 httpClient。
7. 新建 src/services/dataSource.ts：export type DataSource = 'mock' | 'api'；getDataSource() 读 import.meta.env.VITE_DATA_SOURCE，等于 'api' 返回 'api'，否则 'mock'。
8. 新建 src/services/dashboardService.ts：fetchDashboardData(): Promise<DashboardData>。mock 模式 return Promise.resolve({ ...dashboardMock, updatedAt: new Date().toISOString() })；api 模式 const r = await httpClient.get<DashboardData>('/dashboard'); return r.data。
9. 在 src/app/main.ts 开发模式（import.meta.env.DEV）下调用 worker.start({ onUnhandledRequest: 'bypass' })，再挂载 Vue。注意 worker.start 是异步的，要先 await 再 mount。
10. 不要在组件里直接 import dashboardMock——所有数据必须经过 services 层。
11. 版本下限：axios ^1.7、msw ^2.4。装到更新版本可保留但须验证全绿。

验证（必须全部通过）：
- npm run build / lint 全绿（类型正确）
- npm run dev：在 DashboardView 里临时调用 fetchDashboardData().then(d => console.log(d))，控制台应打印出完整 DashboardData（MSW 拦截生效）
- 临时设 VITE_DATA_SOURCE=api 重启，请求应走 Axios（可允许它失败，但要在网络面板看到请求发出，证明分支生效）——验证后改回 mock

完成后告诉我：新建/修改了哪些文件、分层的数据流（组件→service→dataSource→mock/api）、MSW 的作用、已运行的验证及结果。
```

## 验收清单

- [ ] `types/dashboard.ts` 定义了全部接口，类型与 mock 数据吻合
- [ ] `dashboardMock.ts` 数据完整、合理，`hubNodes` 用 0-100 抽象坐标（非经纬度）
- [ ] MSW 已配置，`public/mockServiceWorker.js` 存在且未被 `.gitignore` 忽略
- [ ] `services/` 三件套（http/dataSource/dashboardService）齐全
- [ ] `getDataSource()` 正确读取 `VITE_DATA_SOURCE`
- [ ] 组件**没有**直接 import mock 数据
- [ ] `npm run dev` 控制台能打印出 `fetchDashboardData()` 的结果
- [ ] 切换 `VITE_DATA_SOURCE=api` 后能在网络面板看到 Axios 请求发出
- [ ] `npm run build` / `lint` 全绿

## 思考题 / 进阶

1. 为什么 mock 要用 MSW（拦截 HTTP）而不是直接 `export const data = {...}` 然后 import？（提示：异步、加载态、失败态的真实模拟）
2. `dataSource.ts` 只有一行逻辑，为什么还要单独抽一个文件？（提示：单一职责、未来扩展如 websocket 数据源）
3. 如果后端接口字段和前端类型不一致（比如后端 `user_count` 前端 `userCount`），应该在哪一层做转换？
4. 进阶：给 `fetchDashboardData` 加一个 `forceRefresh` 参数和简单的内存缓存——想想缓存对大屏定时刷新的影响。

---

← [02 · 大屏布局](./02-阶段二-大屏布局与自适应.md) ｜ 下一步 → [04 · 第一个图表与 ECharts 封装](./04-阶段四-第一个图表与ECharts封装.md)
