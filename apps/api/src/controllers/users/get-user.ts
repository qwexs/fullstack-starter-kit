import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import type { HonoEnv } from '../../types/hono'
import { getUserById, userSchema } from '../../data/users'

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const route = createRoute({
  method: 'get',
  path: '/{id}',
  tags: ['Users'],
  summary: 'Get user by ID',
  request: {
    params: paramsSchema,
  },
  responses: {
    200: {
      description: 'User details',
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
    },
    404: {
      description: 'User not found',
    },
  },
})

export const getUserRoute = new OpenAPIHono<HonoEnv>().openapi(route, async (c) => {
  const db = c.get('dbClient')
  const { id } = c.req.valid('param')

  const user = await getUserById(db, id)

  if (!user) {
    throw new HTTPException(404, { message: 'User not found' })
  }

  return c.json(user, 200)
})
