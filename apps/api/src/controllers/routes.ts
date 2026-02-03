import { OpenAPIHono } from '@hono/zod-openapi'
import type { HonoEnv } from '../types/hono'
import { healthRoute } from './health'
import { usersRoutes } from './users'

export const routes = new OpenAPIHono<HonoEnv>()
  .route('/', healthRoute)
  .route('/users', usersRoutes)
