import type { DbClient } from '@starter/db'
import type { User } from './schema'

export interface GetUsersOptions {
  limit?: number
  offset?: number
}

// Example: In-memory store for demonstration
// Replace with actual Kysely queries when you have a users table
const mockUsers: User[] = [
  { id: 1, email: 'alice@example.com', name: 'Alice', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, email: 'bob@example.com', name: 'Bob', createdAt: '2024-01-02T00:00:00Z' },
]

export async function getUsers(_db: DbClient, options: GetUsersOptions = {}): Promise<User[]> {
  const { limit = 20, offset = 0 } = options

  // TODO: Replace with actual query:
  // return db.selectFrom('users').selectAll().limit(limit).offset(offset).execute()

  return mockUsers.slice(offset, offset + limit)
}

export async function getUsersCount(_db: DbClient): Promise<number> {
  // TODO: Replace with actual query:
  // const result = await db.selectFrom('users').select(eb => eb.fn.countAll().as('count')).executeTakeFirst()
  // return Number(result?.count ?? 0)

  return mockUsers.length
}
