import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { StatusCodes } from 'http-status-codes'
import { logger } from './logger'

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }

  logger.error({ err }, 'Unhandled error')
  return c.json(
    { error: 'Internal Server Error' },
    StatusCodes.INTERNAL_SERVER_ERROR
  )
}
