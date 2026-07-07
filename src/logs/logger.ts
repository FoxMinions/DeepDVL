type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogTransport {
  log(level: LogLevel, args: unknown[]): void
}

const consoleTransport: LogTransport = {
  log(level, args) {
    const prefix = `[DeepDVL:${level}]`
    switch (level) {
      case 'warn':
        console.warn(prefix, ...args)
        break
      case 'error':
        console.error(prefix, ...args)
        break
      case 'debug':
        console.debug(prefix, ...args)
        break
      default:
        console.log(prefix, ...args)
    }
  },
}

// 可替换/扩展的 transport 列表；后续接入 Sentry 等平台时追加一个 transport 即可
const transports: LogTransport[] = [consoleTransport]

function emit(level: LogLevel, args: unknown[]): void {
  for (const transport of transports) {
    transport.log(level, args)
  }
}

export const logger = {
  info: (...args: unknown[]) => emit('info', args),
  warn: (...args: unknown[]) => emit('warn', args),
  error: (...args: unknown[]) => emit('error', args),
  debug: (...args: unknown[]) => emit('debug', args),
}
