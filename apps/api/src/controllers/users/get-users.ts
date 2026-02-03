import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import type { HonoEnv } from '../../types/hono'
import { getUsers, getUsersCount, userSchema } from '../../data/users'

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(20),
  offset: z.coerce.number().min(0).default(0),
})

const responseSchema = z.object({
  data: z.array(userSchema),
  pagination: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    hasMore: z.boolean(),
  }),
})

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['Users'],
  summary: 'List all users',
  request: {
    query: querySchema,
  },
  responses: {
    200: {
      description: 'List of users',
      content: {
        'application/json': {
          schema: responseSchema,
        },
      },
    },
  },
})

export const getUsersRoute = new OpenAPIHono<HonoEnv>().openapi(route, async (c) => {
  const db = c.get('dbClient')
  const query = c.req.valid('query')

  const [users, total] = await Promise.all([
    getUsers(db, { limit: query.limit, offset: query.offset }),
    getUsersCount(db),
  ])

  return c.json(
    {
      data: users,
      pagination: {
        total,
        limit: query.limit,
        offset: query.offset,
        hasMore: query.offset + users.length < total,
      },
    },
    200
  )
})
