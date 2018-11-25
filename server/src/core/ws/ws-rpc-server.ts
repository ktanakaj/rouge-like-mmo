/**
 * JSON-RPC2 on WebSocketのマイクロサービスストラテジーモジュール。
 * @module ./core/ws/ws-rpc-server.ts
 */
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { ArgumentsHost } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Observable } from 'rxjs';
import * as WebSocket from 'ws';
import { JsonRpcError, ErrorCode } from 'json-rpc2-implementer';
import { WebSocketRpcConnection } from './ws-rpc-connection';

export interface WebSocketRpcServerConfig {
	/** コントローラのMessagePattern用プレフィックス */
	prefix?: string;
	/** WebSocket通信用のロガー */
	logger?: (level, message) => {};
}

export type WebSocketRpcServerMiddleware = (
	method: string,
	params: any,
	id: string | number,
	connection: WebSocketRpcConnection,
	next: (method: string, params: any, id: string | number, connection: WebSocketRpcConnection) => any,
) => any;

/**
 * JSON-RPC2 on WebSocketのマイクロサービスストラテジークラス。
 */
export class WebSocketRpcServer extends Server implements CustomTransportStrategy {
	/** WebSocketサーバー */
	private server: WebSocket.Server = null;
	/** WebSocketサーバー設定値。 */
	private options: WebSocket.ServerOptions;
	/** イベント管理用エミッター ※多重継承できないためプロパティとして保持 */
	private ev = new EventEmitter();
	/** ミドルウェア配列 */
	private middlewares: WebSocketRpcServerMiddleware[] = [];

	/**
	 * 指定されたWebSocketサーバーを使用するストラテジーを生成する。
	 * @param server WebSocketサーバー生成用の情報。
	 * @param config 追加の設定。
	 */
	constructor(server: WebSocket.ServerOptions, private readonly config: WebSocketRpcServerConfig = {}) {
		super();
		this.options = server;
	}

	/**
	 * 待ち受けを開始する。
	 * @param callback コールバック。
	 */
	public listen(callback: () => void): void {
		this.server = new WebSocket.Server(this.options);

		this.server.on('connection', (ws: WebSocket) => {
			const conn = new WebSocketRpcConnection(ws, Object.assign({
				methodHandler: (method, params, id) => this.handleMessageWithMiddlewares(method, params, id, conn),
			}, this.config));

			this.emit('connection', conn);
		});

		this.server.on('error', (err) => this.emit('error', err));
		callback();
	}

	/**
	 * 待ち受けをクローズする。
	 */
	public close(): void {
		this.server && this.server.close();
		this.server = null;
	}

	/**
	 * 受け取ったメッセージをミドルウェアを経由して処理する。
	 * @param method メソッド名。
	 * @param params 引き数。
	 * @param id リクエストID。
	 * @param connection WebSocketコネクション。
	 * @returns メソッドの戻り値。
	 */
	private handleMessageWithMiddlewares(method: string, params?: any, id?: string | number, connection?: WebSocketRpcConnection): any {
		const func = this.middlewares.reduceRight(
			(next, middleware) => (m, p, i, c) => middleware(m, p, i, c, next),
			this.handleMessage.bind(this));
		return func(method, params, id, connection);
	}

	/**
	 * 受け取ったメッセージを処理する。
	 * @param method メソッド名。
	 * @param params 引き数。
	 * @param id リクエストID。
	 * @param connection WebSocketコネクション。
	 * @returns メソッドの戻り値。
	 */
	private async handleMessage(method: string, params?: any, id?: string | number, connection?: WebSocketRpcConnection): Promise<any> {
		const prefix = this.config.prefix || '';
		const handler: (params, connection, id) => Promise<Observable<any>> = this.getHandlerByPattern(prefix + method);
		if (!handler) {
			throw new JsonRpcError(ErrorCode.MethodNotFound);
		}

		const result = await handler(params, connection, id);
		if (result instanceof Observable) {
			return await result.toPromise();
		}
		return result;
	}

	/**
	 * JSON-RPC2 on WebSocket用のグローバルミドルウェアを登録する。
	 * ※ Nest標準のインターセプターでほとんどのケースは対応可能なためそちらを推奨。
	 *    インターセプターだとAuthGuardの前に入れられないため、そうした一部のケース用に実装。
	 * @param middlewares ミドルウェア。
	 */
	public use(...middlewares: WebSocketRpcServerMiddleware[]): void {
		this.middlewares.push(...middlewares);
	}

	// イベント定義
	on(event: 'connection', listener: (connection: WebSocketRpcConnection) => void): this;
	on(event: 'error', listener: (err: Error) => void): this;
	public on(event: string | symbol, listener: (...args: any[]) => void): this {
		this.ev.on(event, listener);
		return this;
	}

	private emit(event: 'connection', connection: WebSocketRpcConnection): boolean;
	private emit(event: 'error', err: Error): boolean;
	private emit(event: string | symbol, ...args: any[]): boolean {
		return this.ev.emit(event, ...args);
	}
}

/**
 * 引数情報がJSON-RPC2 on WebSocketか？
 * @param host 引数情報。
 * @returns JSON-RPC2 on WebSocketの場合true。
 */
export function isWebSocketRpc(host: ArgumentsHost): boolean {
	// フラグ的なものが無いので、第2引き数にコネクションが渡ってきているかで判定
	return host.getArgs()[1] instanceof WebSocketRpcConnection;
}