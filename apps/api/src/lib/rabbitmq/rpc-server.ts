import type { Connection, Consumer, AsyncMessage } from 'rabbitmq-client'
import { getRabbitMQConnectionManager } from './connection'
import { logger } from '../../middlewares'

export type RpcHandler<TRequest = unknown, TResponse = unknown> = (
  request: TRequest
) => Promise<TResponse>

export interface RpcResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}

interface RpcHandlerConfig {
  queue: string
  handler: RpcHandler
  prefetchCount: number
}

export class RabbitMQRpcServer {
  private connection: Connection | null = null
  private consumers: Consumer[] = []
  private handlers: Map<string, RpcHandlerConfig> = new Map()

  registerHandler<TRequest, TResponse>(
    queue: string,
    handler: RpcHandler<TRequest, TResponse>,
    options?: { prefetchCount?: number }
  ): void {
    this.handlers.set(queue, {
      queue,
      handler: handler as RpcHandler,
      prefetchCount: options?.prefetchCount ?? 1,
    })
    logger.info({ queue }, 'RPC handler registered')
  }

  async initialize(): Promise<void> {
    const connectionManager = getRabbitMQConnectionManager()
    this.connection = await connectionManager.getConnection()

    for (const config of this.handlers.values()) {
      const consumer = this.createConsumer(config)
      this.consumers.push(consumer)
    }

    logger.info(
      { handlerCount: this.handlers.size },
      'RabbitMQ RPC server initialized'
    )
  }

  private createConsumer(config: RpcHandlerConfig): Consumer {
    if (!this.connection) {
      throw new Error('Connection not initialized')
    }

    return this.connection.createConsumer(
      {
        queue: config.queue,
        queueOptions: { durable: true },
        qos: { prefetchCount: config.prefetchCount },
      },
      async (msg: AsyncMessage, reply) => {
        const startTime = Date.now()

        try {
          const request = this.parseMessageBody(msg)
          logger.debug({ queue: config.queue, request }, 'RPC request received')

          const result = await config.handler(request)

          const duration = Date.now() - startTime
          logger.debug(
            { queue: config.queue, duration },
            'RPC request completed'
          )

          await reply({ success: true, data: result } as RpcResponse)
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'

          logger.error(
            { err: error, queue: config.queue },
            'RPC handler error'
          )

          await reply({ success: false, error: errorMessage } as RpcResponse)
        }
      }
    )
  }

  private parseMessageBody(msg: AsyncMessage): unknown {
    const body = msg.body

    if (Buffer.isBuffer(body)) {
      return JSON.parse(body.toString())
    }

    if (typeof body === 'string') {
      return JSON.parse(body)
    }

    return body
  }

  async close(): Promise<void> {
    for (const consumer of this.consumers) {
      await consumer.close()
    }
    this.consumers = []
    logger.info('RabbitMQ RPC server closed')
  }
}

let rpcServer: RabbitMQRpcServer | null = null

export function getRabbitMQRpcServer(): RabbitMQRpcServer {
  if (!rpcServer) {
    rpcServer = new RabbitMQRpcServer()
  }
  return rpcServer
}
