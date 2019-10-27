/**
 * JSON-RPC2 on Redis pubsubのマイクロサービスストラテジーサーバーモジュール。
 * @module ./core/redis/redis-rpc-server.ts
 */
import { Server, CustomTransportStrategy } from '@nestjs/microservices';
import { ArgumentsHost } from '@nestjs/common';
import { EventEmitter } from 'events';
import { Observable } from 'rxjs';
import { JsonRpcError, ErrorCode } from 'json-rpc2-implementer';
import { IRedisConfig, getClient } from './redis-helper';
import { RedisRpcConnection } from './redis-rpc-connection';

export interface RedisRpcServerConfig {
	/** コントローラのMessagePattern用プレフィックス */
	prefix?: string;
	/** Subscribeするキー。 */
	key?: string;
	/** Redis pub/sub用のロガー */
	logger?: (level, message) => {};
}

export type RedisRpcServerMiddleware = (
	method: string,
	params: any,
	id: string | number,
	conn: RedisRpcConnection,
	next: (method: string, params: any, id: string | number, conn: RedisRpcConnection) => any,
) => any;

/** デフォルトのサブスクライブキー。 */
export const DEFAULT_KEY = 'jsonrpc2';

/**
 * JSON-RPC2 on Redis pubsubのマイクロサービスストラテジーサーバークラス。
 *
 * Redisのpubsubを使ったマイクロサービスはNest標準でもサポートされているが、
 * 1対1の通信しかサポートしていないようなので、1対多の通信のような
 * 変則的な構成を実現するために独自実装。
 */
export class RedisRpcServer extends Server implements CustomTransportStrategy {
	/** Redis pub/subによるコネクション。 */
	private connection: RedisRpcConnection = null;
	/** Redis接続設定値。 */
	private redis: IRedisConfig;
	/** サーバー設定値。 */
	private config: RedisRpcServerConfig;
	/** イベント管理用エミッター ※多重継承できないためプロパティとして保持 */
	private ev = new EventEmitter();
	/** ミドルウェア配列 */
	private middlewares: RedisRpcServerMiddleware[] = [];

	/**
	 * 指定されたRedisでpubsubするストラテジーを生成する。
	 * @param server Redis接続用の情報。
	 * @param config 追加の設定。
	 */
	constructor(redis: IRedisConfig, config: RedisRpcServerConfig = {}) {
		super();
		this.redis = redis;
		this.config = config;
		if (!config.key) {
			this.config.key = DEFAULT_KEY;
		}
	}

	/**
	 * 待ち受けを開始する。
	 * @param callback コールバック。
	 */
	public listen(callback: () => void): void {
		const options = {};
		if (this.config.logger) {
			// ログそのままだとServer/Client混在時に分かり辛いので付ける
			options['logger'] = (level, message) => this.config.logger(level, `${message} #server`);
		}
		const conn = new RedisRpcConnection(this.redis, this.config.key, Object.assign({
			methodHandler: (method, params, id) => this.handleMessageWithMiddlewares(method, params, id, conn),
		}, options));
		conn.on('error', (err) => this.emit('error', err));
		this.connection = conn;
		callback();
	}

	/**
	 * 待ち受けをクローズする。
	 */
	public close(): void {
		if (this.connection) {
			this.connection.unsubscribe();
		}
		this.connection = null;
	}

	/**
	 * 受け取ったメッセージをミドルウェアを経由して処理する。
	 * @param method メソッド名。
	 * @param params 引き数。
	 * @param id リクエストID。
	 * @param connection Redis pub/subコネクション。
	 * @returns メソッドの戻り値。
	 */
	private handleMessageWithMiddlewares(method: string, params?: any, id?: string | number, connection?: RedisRpcConnection): any {
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
	 * @param connection Redis pub/subコネクション。
	 * @returns メソッドの戻り値。
	 */
	private async handleMessage(method: string, params?: any, id?: string | number, connection?: RedisRpcConnection): Promise<any> {
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
	 * JSON-RPC2 on Redis用のグローバルミドルウェアを登録する。
	 * ※ Nest標準のインターセプターでほとんどのケースは対応可能なためそちらを推奨。
	 * @param middlewares ミドルウェア。
	 */
	public use(...middlewares: RedisRpcServerMiddleware[]): void {
		this.middlewares.push(...middlewares);
	}

	// イベント定義
	on(event: 'error', listener: (err: Error) => void): this;
	public on(event: string | symbol, listener: (...args: any[]) => void): this {
		this.ev.on(event, listener);
		return this;
	}

	private emit(event: 'error', err: Error): boolean;
	private emit(event: string | symbol, ...args: any[]): boolean {
		return this.ev.emit(event, ...args);
	}
}

/**
 * 引数情報がJSON-RPC2 on Redisか？
 * @param host 引数情報。
 * @returns JSON-RPC2 on Redisの場合true。
 */
export function isRedisRpc(host: ArgumentsHost): boolean {
	// フラグ的なものが無いので、第2引き数にRedisコネクションが渡ってきているかで判定
	return host.getArgs()[1] instanceof RedisRpcConnection;
}

/**
 * 多対多通信の排他用ロックを取得する。
 * @param config ロックに使用するRedisの接続情報。
 * @param id ロックするリクエストID。
 * @param timeout ロック有効期間。デフォルトはJSON-RPC2のデフォルトタイムアウト時間×2。
 * @returns ロックに成功した場合true。
 */
export async function lockRequest(config: IRedisConfig, id: string, timeout: number = 120000): Promise<boolean> {
	// ※ @typesの型定義には無いが、RedisのsetコマンドとしてはNX,EX同時に渡せたので無理やり実行
	const client = getClient(config);
	const func = client.setAsync as Function;
	const res = await func.apply(client, [`jsonrpc2:lock:${id}`, '1', 'NX', 'EX', timeout]);
	return !!res;
}
