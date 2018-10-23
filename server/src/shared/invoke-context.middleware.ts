/**
 * リクエストごとのコンテキスト情報を作成するミドルウェア。
 * @module ./shared/invoke-context.middleware
 */
import * as express from 'express';
import { WebSocketRpcConnection } from '../core/ws/ws-rpc-connection';
import invoketContext from './invoke-context';

/**
 * リクエストごとのコンテキスト情報を作成するexpressミドルウェア。
 * @param req リクエスト。
 * @param res レスポンス。
 * @param next 次の処理呼び出し用のコールバック。
 */
export function invokeContextHandler(req: express.Request, res: express.Response, next: express.NextFunction): void {
	invoketContext.run(() => {
		invoketContext.setDate();
		invoketContext.setLatestMasterVersion().then(next).catch(next);
	});
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
export function invokeContextRpcHandler(
	method: string,
	params: any,
	id: string | number,
	connection: WebSocketRpcConnection,
	next: (method: string, params: any, id: string | number, connection: WebSocketRpcConnection) => any,
): any {
	return new Promise((resolve, reject) => {
		invoketContext.run(() => {
			invoketContext.setDate();
			invoketContext.setLatestMasterVersion()
				.then(() => {
					resolve(next(method, params, id, connection));
				}).catch(reject);
		});
	});
}
