import { logger } from '../../middlewares'

// Re-export for handler registration
export type { RpcHandler, RpcResponse } from './rpc-server'
export { getRabbitMQRpcServer } from './rpc-server'

/**
 * RPC Queue names
 * Define your RPC queues here
 */
export const RPC_QUEUES = {
  // Example: EXAMPLE_QUEUE: 'rpc.example.queue',
} as const

/**
 * Request/Response types for RPC handlers
 */
// Example:
// interface ExampleRequest {
//   id: string
// }
// interface ExampleResponse {
//   result: string
// }

/**
 * RPC Handler implementations
 */
// Example:
// async function handleExample(request: ExampleRequest): Promise<ExampleResponse> {
//   logger.debug({ request }, 'Processing example request')
//   return { result: `Processed: ${request.id}` }
// }

/**
 * Register all RPC handlers
 * Call this function during application initialization
 */
export function registerRpcHandlers(): void {
  // Get RPC server instance for handler registration
  // const rpcServer = getRabbitMQRpcServer()

  // Example:
  // rpcServer.registerHandler<ExampleRequest, ExampleResponse>(
  //   RPC_QUEUES.EXAMPLE_QUEUE,
  //   handleExample
  // )

  logger.info('RPC handlers registered')
}
