import pino from 'pino'
import { logger as honoLogger } from 'hono/logger'
import { env } from '../env'

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: env.NODE_ENV === 'development' ? { target: 'pino-pretty' } : undefined,
})

export const loggerMiddleware = honoLogger((message) => {
  logger.info(message)
})
