/**
 * リクエストごとのコンテキスト情報を作成するミドルウェア。
 * @module ./shared/invoke-context.middleware
 */
import * as express from 'express';
import { WebSocketRpcConnection } from '../core/ws';
import { RedisRpcConnection } from '../core/redis';
import invoketContext from './invoke-context';

/**
 * リクエストごとのコンテキスト情報を作成するexpressミドルウェア。
 * @param req リクエスト。
 * @param res レスポンス。
 * @param next 次の処理呼び出し用のコールバック。
 */
export function invokeContextHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
	invoketContext.setLatestMasterVersion().then(next).catch(next);
}

/**
 * リクエストごとのコンテキスト情報を作成するJSON-RPC2 on WebSocketミドルウェア。
 * @param method メソッド名。
 * @param params 引き数。
 * @param id リクエストID。
 * @param connection WebSocketコネクション。
 * @param next 次の処理呼び出し用のコールバック。
 * @returns コールバックの戻り値。
 */
export function invokeContextWsRpcHandler(
	method: string,
	params: any,
	id: string | number,
	connection: WebSocketRpcConnection,
	next: (method: string, params: any, id: string | number, connection: WebSocketRpcConnection) => any,
): any {
	return invoketContext.setLatestMasterVersion()
		.then(() => next(method, params, id, connection));
}

/**
 * リクエストごとのコンテキスト情報を作成するJSON-RPC2 on Redisミドルウェア。
 * @param method メソッド名。
 * @param params 引き数。
 * @param id リクエストID。
 * @param connection Redisコネクション。
 * @param next 次の処理呼び出し用のコールバック。
 * @returns コールバックの戻り値。
 */
export function invokeContextRedisRpcHandler(
	method: string,
	params: any,
	id: string | number,
	connection: RedisRpcConnection,
	next: (method: string, params: any, id: string | number, connection: RedisRpcConnection) => any,
): any {
	return invoketContext.setLatestMasterVersion()
		.then(() => next(method, params, id, connection));
}
