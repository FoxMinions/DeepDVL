/**
 * 监听元素尺寸变化，触发回调。
 * 返回 ResizeObserver 实例，调用方需在卸载时 disconnect() 以释放资源。
 */
export function observeResize(target: HTMLElement, callback: () => void): ResizeObserver {
  const observer = new ResizeObserver(() => callback())
  observer.observe(target)
  return observer
}
