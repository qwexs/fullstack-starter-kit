# Fullstack Starter Kit

> Production-ready monorepo with **Bun**, **Hono**, **Astro 6**, **Kysely** & **PostgreSQL**

[![Bun](https://img.shields.io/badge/Bun-1.3+-black?logo=bun)](https://bun.sh)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9+-blue?logo=typescript)](https://www.typescriptlang.org)
[![Hono](https://img.shields.io/badge/Hono-4.x-orange)](https://hono.dev)
[![Astro](https://img.shields.io/badge/Astro-6.x-purple?logo=astro)](https://astro.build)

## Features

- **Turborepo** — High-performance monorepo build system
- **Bun Runtime** — Fast all-in-one JavaScript runtime
- **Hono** — Ultrafast web framework with OpenAPI support
- **Kysely** — Type-safe SQL query builder
- **Astro 6** — Content-first web framework with islands architecture
- **React 19** — For interactive components
- **Tailwind CSS 4** — Utility-first CSS framework
- **shadcn/ui** — Beautiful, accessible components
- **RabbitMQ** — Message queue integration (optional)
- **Pino** — Fast JSON logger

## Stack

| Layer | Technology |
|-------|------------|
| **Runtime** | Bun |
| **Backend** | Hono, Kysely, Zod, Pino |
| **Frontend** | Astro 6, React 19, Tailwind CSS 4 |
| **Database** | PostgreSQL |
| **Queue** | RabbitMQ |
| **Tooling** | Turborepo, TypeScript 5.9 |

## Project Structure

```
├── apps/
│   ├── api/                 # Hono backend
│   │   ├── src/
│   │   │   ├── bun.ts       # Entry point
│   │   │   ├── app.ts       # Hono app config
│   │   │   ├── controllers/ # Routes + handlers
│   │   │   ├── data/        # Data access layer
│   │   │   ├── middlewares/ # Hono middlewares
│   │   │   └── lib/         # Integrations
│   │   └── package.json
│   └── web/                 # Astro frontend
│       ├── src/
│       │   ├── pages/       # Astro pages
│       │   ├── layouts/     # Layout components
│       │   └── components/  # React + Astro components
│       └── package.json
├── packages/
│   └── db/                  # Shared database package
│       ├── src/
│       │   ├── client.ts    # Kysely client
│       │   └── types.ts     # Generated types
│       └── package.json
├── turbo.json
└── package.json
```

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/fullstack-starter-kit.git
cd fullstack-starter-kit

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env

# Generate database types (requires running PostgreSQL)
bun run db:generate

# Start development servers
bun run dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all dev servers |
| `bun run build` | Build all packages |
| `bun run check-types` | Type check all packages |
| `bun run db:generate` | Generate Kysely types from DB |
| `bun run format` | Format code with Prettier |

## Environment Variables

```bash
# API
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb

# RabbitMQ (optional)
RABBITMQ_URL=amqp://user:password@localhost:5672

# Frontend
PUBLIC_API_URL=http://localhost:3000
```

## API Example

```typescript
// controllers/users/get-users.ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { getUsers } from '../../data/users'

const route = createRoute({
  method: 'get',
  path: '/',
  tags: ['Users'],
  responses: {
    200: {
      description: 'List of users',
      content: { 'application/json': { schema: userSchema } },
    },
  },
})

export const getUsersRoute = new OpenAPIHono()
  .openapi(route, async (c) => {
    const db = c.get('dbClient')
    const users = await getUsers(db)
    return c.json({ data: users }, 200)
  })
```

## Database Layer

```typescript
// data/users/get-users.ts
import type { DbClient } from '@starter/db'

export async function getUsers(db: DbClient) {
  return db
    .selectFrom('users')
    .selectAll()
    .orderBy('created_at', 'desc')
    .execute()
}
```

## Frontend Component

```astro
---
// pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro'
import { Button } from '../components/ui/button'
---

<BaseLayout title="Home">
  <Button variant="default">Click me</Button>
</BaseLayout>
```

## Documentation

- API Docs: `http://localhost:3000/docs` (Swagger UI)
- OpenAPI Spec: `http://localhost:3000/openapi.json`

## License

MIT
