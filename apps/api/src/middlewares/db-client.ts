import { createMiddleware } from 'hono/factory'
import { createDbClient } from '@starter/db'
import type { HonoEnv } from '../types/hono'

const dbClient = createDbClient()

export const setUpDbClient = createMiddleware<HonoEnv>(async (c, next) => {
  c.set('dbClient', dbClient)
  await next()
})

export { dbClient }
