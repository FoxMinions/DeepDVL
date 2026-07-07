export type MetricStatus = 'good' | 'warning' | 'danger'

export interface SummaryMetric {
  id: string
  label: string
  value: number
  unit: string
  trend: number
  status: MetricStatus
}

export interface TrendPoint {
  time: string
  visits: number
  orders: number
}

export interface CategoryItem {
  name: string
  value: number
}

export interface RankingItem {
  city: string
  value: number
}

export interface RadarIndicator {
  name: string
  max: number
}

export interface RadarData {
  indicators: RadarIndicator[]
  values: number[]
}

export type ActivityLevel = 'info' | 'warning' | 'success'

export interface ActivityItem {
  id: string
  time: string
  level: ActivityLevel
  message: string
}

export type NodeStatus = 'good' | 'warning' | 'danger'

export interface HubNode {
  id: string
  name: string
  value: number
  coord: [number, number]
  status: NodeStatus
  description: string
}

export interface DashboardData {
  updatedAt: string
  summary: SummaryMetric[]
  trend: TrendPoint[]
  categories: CategoryItem[]
  ranking: RankingItem[]
  radar: RadarData
  activities: ActivityItem[]
  hubNodes: HubNode[]
}
