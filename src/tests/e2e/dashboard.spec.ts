import { expect, test } from '@playwright/test'

test('大屏页面加载并显示核心内容', async ({ page }) => {
  await page.goto('/')

  // 标题可见
  await expect(page.locator('h1')).toBeVisible()

  // 至少一个指标卡片
  await expect(page.locator('[data-testid="metric-card"]').first()).toBeVisible({
    timeout: 10000,
  })

  // 至少一个图表容器存在
  const chart = page.locator(
    '[data-testid="line-trend-chart"], [data-testid="data-hub-chart"]',
  )
  await expect(chart.first()).toBeVisible({ timeout: 10000 })

  // 无横向滚动条
  const noHorizontalScroll = await page.evaluate(
    () => document.body.scrollWidth <= window.innerWidth,
  )
  expect(noHorizontalScroll).toBe(true)
})
