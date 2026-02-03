import { app } from './app'
import { env } from './env'
import { logger, dbClient } from './middlewares'
import {
  getRabbitMQConnectionManager,
  getRabbitMQPublisher,
  getRabbitMQRpcServer,
  registerRpcHandlers,
} from './lib/rabbitmq'

// Initialize RabbitMQ services
async function initializeRabbitMQ() {
  try {
    const connectionManager = getRabbitMQConnectionManager()
    await connectionManager.getConnection()
    logger.info('RabbitMQ connected')
  } catch (error) {
    logger.warn({ err: error }, 'RabbitMQ connection failed, continuing without queue')
    return
  }

  try {
    const publisher = getRabbitMQPublisher()
    await publisher.initialize()
    logger.info('RabbitMQ publisher initialized')
  } catch (error) {
    logger.error({ err: error }, 'RabbitMQ publisher initialization failed')
  }

  try {
    registerRpcHandlers()
    const rpcServer = getRabbitMQRpcServer()
    await rpcServer.initialize()
    logger.info('RabbitMQ RPC server initialized')
  } catch (error) {
    logger.error({ err: error }, 'RabbitMQ RPC server initialization failed')
  }
}

// Graceful shutdown
const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down...`)

  try {
    const rpcServer = getRabbitMQRpcServer()
    await rpcServer.close()

    const publisher = getRabbitMQPublisher()
    await publisher.close()

    const connectionManager = getRabbitMQConnectionManager()
    await connectionManager.close()
  } catch (error) {
    logger.error({ err: error }, 'Error closing RabbitMQ connections')
  }

  await dbClient.destroy()
  process.exit(0)
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

// Initialize services
await initializeRabbitMQ()

logger.info(`Starting server on port ${env.PORT}...`)

export default {
  port: env.PORT,
  fetch: app.fetch,
}
