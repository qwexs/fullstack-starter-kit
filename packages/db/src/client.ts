import { Kysely, sql } from 'kysely'
import { BunDialect } from '@qwexs/kysely-bun-psql'
import type { DB } from './types'
import { env } from './env'

export function createDbClient() {
  return new Kysely<DB>({
    dialect: new BunDialect({
      url: env.DATABASE_URL,
      max: 20,
      connectionTimeout: 35,
      idleTimeout: 30,
      maxLifetime: 86400,
    }),
  })
}

export { sql }

export type DbClient = ReturnType<typeof createDbClient>
