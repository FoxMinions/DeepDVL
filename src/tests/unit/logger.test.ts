import { describe, expect, it, vi } from 'vitest'

vi.stubEnv('VITE_DATA_SOURCE', 'mock')

describe('logger', () => {
  it('calls console.log for info level', async () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { logger } = await import('../../logs/logger')
    logger.info('test')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('calls console.warn for warn level', async () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { logger } = await import('../../logs/logger')
    logger.warn('test')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('calls console.error for error level', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const { logger } = await import('../../logs/logger')
    logger.error('test')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('calls console.debug for debug level', async () => {
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {})
    const { logger } = await import('../../logs/logger')
    logger.debug('test')
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
