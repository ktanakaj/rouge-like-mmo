/**
 * Redis pub/subクライアント定義モジュール。
 * @module ./core/redis/redis-rpc-client.provider
 */
import * as config from 'config';
import * as log4js from 'log4js';
import { RedisRpcClient } from './redis-rpc-client';
const redisLogger = log4js.getLogger('redis');

/** RedisRpcClientのプロバイダー */
export const redisRpcClientProvider = {
	provide: RedisRpcClient,
	useValue: new RedisRpcClient(config['redis']['pubsub'], {
		logger: (level, message) => redisLogger[level](message),
	}),
};
