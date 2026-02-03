import { Connection } from 'rabbitmq-client'
import { env } from '../../env'
import { logger } from '../../middlewares'

export interface RabbitMQConnectionOptions {
  url?: string
  heartbeat?: number
  connectionTimeout?: number
  retryLow?: number
  retryHigh?: number
}

class RabbitMQConnectionManager {
  private connection: Connection | null = null
  private url: string
  private options: RabbitMQConnectionOptions

  constructor(options: RabbitMQConnectionOptions = {}) {
    this.url = options.url ?? env.RABBITMQ_URL
    this.options = {
      heartbeat: options.heartbeat ?? 30,
      connectionTimeout: options.connectionTimeout ?? 10000,
      retryLow: options.retryLow ?? 1000,
      retryHigh: options.retryHigh ?? 30000,
    }
  }

  async getConnection(): Promise<Connection> {
    if (this.connection) {
      return this.connection
    }

    this.connection = new Connection({
      url: this.url,
      heartbeat: this.options.heartbeat,
      connectionTimeout: this.options.connectionTimeout,
      retryLow: this.options.retryLow,
      retryHigh: this.options.retryHigh,
    })

    this.connection.on('connection', () => {
      logger.info('RabbitMQ connection established')
    })

    this.connection.on('error', (error) => {
      logger.error({ err: error }, 'RabbitMQ connection error')
    })

    this.connection.on('connection.blocked', (reason) => {
      logger.warn({ reason }, 'RabbitMQ connection blocked')
    })

    this.connection.on('connection.unblocked', () => {
      logger.info('RabbitMQ connection unblocked')
    })

    return this.connection
  }

  isConnected(): boolean {
    return this.connection !== null
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.close()
      this.connection = null
      logger.info('RabbitMQ connection closed')
    }
  }
}

let connectionManager: RabbitMQConnectionManager | null = null

export function getRabbitMQConnectionManager(
  options?: RabbitMQConnectionOptions
): RabbitMQConnectionManager {
  if (!connectionManager) {
    connectionManager = new RabbitMQConnectionManager(options)
  }
  return connectionManager
}
