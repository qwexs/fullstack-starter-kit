import { z } from 'zod'

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.string().datetime(),
})

export const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
})

export type User = z.infer<typeof userSchema>
export type CreateUser = z.infer<typeof createUserSchema>
