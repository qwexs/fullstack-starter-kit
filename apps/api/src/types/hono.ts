import type { DbClient } from '@starter/db'

export interface HonoEnv {
  Variables: {
    dbClient: DbClient
  }
}
