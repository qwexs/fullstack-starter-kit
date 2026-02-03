import { OpenAPIHono, createRoute } from '@hono/zod-openapi'
import type { HonoEnv } from '../../types/hono'
import { createUser, createUserSchema, userSchema } from '../../data/users'

const route = createRoute({
  method: 'post',
  path: '/',
  tags: ['Users'],
  summary: 'Create a new user',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'User created',
      content: {
        'application/json': {
          schema: userSchema,
        },
      },
    },
  },
})

export const createUserRoute = new OpenAPIHono<HonoEnv>().openapi(route, async (c) => {
  const db = c.get('dbClient')
  const data = c.req.valid('json')

  const user = await createUser(db, data)

  return c.json(user, 201)
})
