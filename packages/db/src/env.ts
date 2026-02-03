import { config } from 'dotenv'
import { resolve } from 'path'
import { z } from 'zod'

config({ path: resolve(__dirname, '../../../.env') })

const envSchema = z.object({
  DATABASE_URL: z.url(),
})

export const env = envSchema.parse(process.env)
