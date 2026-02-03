import type { DbClient } from '@starter/db'
import type { CreateUser, User } from './schema'

// Example: In-memory counter for demonstration
let nextId = 3

export async function createUser(_db: DbClient, data: CreateUser): Promise<User> {
  // TODO: Replace with actual query:
  // return db.insertInto('users').values(data).returningAll().executeTakeFirstOrThrow()

  const user: User = {
    id: nextId++,
    email: data.email,
    name: data.name,
    createdAt: new Date().toISOString(),
  }

  return user
}
