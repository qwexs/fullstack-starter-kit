import { OpenAPIHono } from '@hono/zod-openapi'
import type { HonoEnv } from '../../types/hono'
import { getUsersRoute } from './get-users'
import { getUserRoute } from './get-user'
import { createUserRoute } from './create-user'

export const usersRoutes = new OpenAPIHono<HonoEnv>()
  .route('/', getUsersRoute)
  .route('/', getUserRoute)
  .route('/', createUserRoute)
