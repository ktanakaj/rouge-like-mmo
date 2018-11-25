/**
 * Redisのpub/sub上のJSON-RPC2コネクションクラスのモジュール。
 * @module ./core/redis/redis-rpc-connection
 */
import * as Random from 'random-js';
import { JsonRpc2Implementer } from 'json-rpc2-implementer';
import { IRedisConfig } from './redis-helper';
import { RedisConnection, RedisConnectionOptions } from './redis-connection';
const random = new Random();

/**
 * Redisのpub/sub上のJSON-RPC2コネクションのオプション引数。
 */
export interface RedisRpcConnectionOptions extends RedisConnectionOptions {
	/** メソッドコールのハンドラー */
	methodHandler?: (method: string, params?: any, id?: number | string) => any;
}
/**
 * Redisのpub/sub上のJSON-RPC2コネクションクラス。
 *
 * pub/subを使用する関係上、多対多のような状態で使われることも想定。
 */
export class RedisRpcConnection extends RedisConnection {
	/** JSON-RPC2実装 */
	public readonly rpc: JsonRpc2Implementer;

	/**
	 * 指定されたキーでコネクションを作成する。
	 * @param config Redis接続設定。
	 * @param key pub/subするキー。
	 * @param options オプション。
	 */
	constructor(config: IRedisConfig, key: string, options: RedisRpcConnectionOptions) {
		super(config, key, options);
		this.rpc = new JsonRpc2Implementer();
		this.rpc.methodHandler = options.methodHandler;
		this.on('message', (message) => this.rpc.receive(message).catch((err) => this.logger('error', `RECEIVE ERROR ${err}`)));
		this.rpc.sender = (message) => {
			this.publish(message, false).catch((err) => this.logger('error', `SEND ERROR ${err}`));
		};
	}

	/**
	 * JSON-RPC2リクエストを送信する。
	 * @param method メソッド名。
	 * @param params 引数。
	 * @return メソッドの処理結果。
	 */
	call<T>(method: string, params: any): Promise<T> {
		// 多対多でIDが被らないようランダムなUUIDを使用する
		return this.rpc.call(method, params, random.uuid4());
	}

	/**
	 * JSON-RPC2通知リクエストを送信する。
	 * @param method メソッド名。
	 * @param params 引数。
	 * @return 処理状態。
	 */
	notice(method: string, params: any): Promise<void> {
		return this.rpc.notice(method, params);
	}
}
