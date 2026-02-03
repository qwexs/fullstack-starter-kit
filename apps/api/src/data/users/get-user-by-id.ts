import type { DbClient } from '@starter/db'
import type { User } from './schema'

// Example: In-memory store for demonstration
const mockUsers: User[] = [
  { id: 1, email: 'alice@example.com', name: 'Alice', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, email: 'bob@example.com', name: 'Bob', createdAt: '2024-01-02T00:00:00Z' },
]

export async function getUserById(_db: DbClient, id: number): Promise<User | null> {
  // TODO: Replace with actual query:
  // return db.selectFrom('users').selectAll().where('id', '=', id).executeTakeFirst() ?? null

  return mockUsers.find((u) => u.id === id) ?? null
}
