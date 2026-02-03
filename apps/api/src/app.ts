import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { errorHandler, loggerMiddleware, setUpDbClient } from './middlewares'
import { routes } from './controllers/routes'
import type { HonoEnv } from './types/hono'

export const app = new OpenAPIHono<HonoEnv>()

// Middlewares
app.use('*', cors())
app.use('*', loggerMiddleware)
app.use('*', setUpDbClient)
app.onError(errorHandler)

// Routes
app.route('/api', routes)

// OpenAPI docs
app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Starter API',
    version: '1.0.0',
    description: 'Production-ready API starter with Hono + Kysely + PostgreSQL',
  },
})
app.get('/docs', swaggerUI({ url: '/openapi.json' }))

// Root redirect
app.get('/', (c) => c.redirect('/docs'))
