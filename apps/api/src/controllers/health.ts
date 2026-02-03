import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import type { HonoEnv } from '../types/hono'
import { sql } from 'kysely'

const responseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string(),
  database: z.enum(['connected', 'disconnected']),
})

const route = createRoute({
  method: 'get',
  path: '/health',
  tags: ['System'],
  summary: 'Service health check',
  responses: {
    200: {
      description: 'Service status',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },
  },
})

export const healthRoute = new OpenAPIHono<HonoEnv>().openapi(route, async (c) => {
  const db = c.get('dbClient')
  let dbStatus: 'connected' | 'disconnected' = 'disconnected'

  try {
    await sql`SELECT 1`.execute(db)
    dbStatus = 'connected'
  } catch {
    dbStatus = 'disconnected'
  }

  return c.json(
    {
      status: dbStatus === 'connected' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      database: dbStatus,
    },
    200
  )
})
