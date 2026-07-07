import { describe, expect, it, vi } from 'vitest'

type Cb = () => void

describe('observeResize', () => {
  it('calls observer.observe with the given element', async () => {
    const el = document.createElement('div')

    let observed: Element | null = null
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn(() => ({
        observe: (target: Element) => {
          observed = target
        },
        unobserve: () => {},
        disconnect: () => {},
      })),
    )

    const { observeResize } = await import('../../utils/resize')
    const observer = observeResize(el, () => {})
    expect(observed).toBe(el)
    observer.disconnect()
  })

  it('calls callback on resize', async () => {
    const el = document.createElement('div')

    let stored: Cb | undefined
    vi.stubGlobal(
      'ResizeObserver',
      vi.fn((cb: Cb) => ({
        observe: () => {
          stored = cb
        },
        unobserve: () => {},
        disconnect: () => {},
      })),
    )

    const { observeResize } = await import('../../utils/resize')

    let called = false
    const observer = observeResize(el, () => {
      called = true
    })

    stored?.()
    expect(called).toBe(true)
    observer.disconnect()
  })
})
