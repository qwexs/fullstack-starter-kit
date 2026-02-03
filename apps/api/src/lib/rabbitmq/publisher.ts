import type { Connection, Publisher } from 'rabbitmq-client'
import { getRabbitMQConnectionManager } from './connection'
import { logger } from '../../middlewares'

export class RabbitMQPublisher {
  private connection: Connection | null = null
  private publisher: Publisher | null = null
  private declaredQueues = new Set<string>()

  async initialize(): Promise<void> {
    const connectionManager = getRabbitMQConnectionManager()
    this.connection = await connectionManager.getConnection()

    this.publisher = this.connection.createPublisher({
      confirm: true,
      maxAttempts: 3,
    })

    logger.info('RabbitMQ publisher initialized')
  }

  async publish(queue: string, message: object): Promise<boolean> {
    if (!this.publisher || !this.connection) {
      logger.error('Publisher not initialized')
      return false
    }

    try {
      await this.ensureQueue(queue)

      await this.publisher.send(
        { routingKey: queue, durable: true },
        message
      )

      logger.debug({ queue, message }, 'Message published')
      return true
    } catch (error) {
      logger.error({ err: error, queue }, 'Failed to publish message')
      return false
    }
  }

  private async ensureQueue(queue: string): Promise<void> {
    if (this.declaredQueues.has(queue) || !this.connection) {
      return
    }

    const dlqQueue = `${queue}.dlq`

    await this.connection.queueDeclare({
      queue: dlqQueue,
      durable: true,
      passive: false,
    })

    await this.connection.queueDeclare({
      queue,
      durable: true,
      passive: false,
      arguments: {
        'x-dead-letter-exchange': '',
        'x-dead-letter-routing-key': dlqQueue,
      },
    })

    this.declaredQueues.add(queue)
    logger.info({ queue, dlqQueue }, 'Queue declared successfully')
  }

  async close(): Promise<void> {
    if (this.publisher) {
      await this.publisher.close()
      this.publisher = null
      logger.info('RabbitMQ publisher closed')
    }
  }
}

let publisher: RabbitMQPublisher | null = null

export function getRabbitMQPublisher(): RabbitMQPublisher {
  if (!publisher) {
    publisher = new RabbitMQPublisher()
  }
  return publisher
}
