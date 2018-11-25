/**
 * Redisのpub/subをコネクション的に扱うクラスのモジュール。
 * @module ./core/redis/redis-connection
 */
import { EventEmitter } from 'events';
import { createClient, IRedisClientAsync, IRedisConfig } from './redis-helper';

/**
 * Redisコネクションのオプション引数。
 */
export interface RedisConnectionOptions {
	/** 通信ロガー。 */
	logger?: (level: string, message: string) => void;
}

/**
 * Redisのpub/subをコネクション的に扱うクラス。
 *
 * サブスクライブ用のコネクション（常時接続）と、
 * パブリッシュ用のコネクション（送信時のみ接続）
 * の2本のコネクションにより通信を行う。
 * 1対1の他、1対多や多対多の通信も可能。
 */
export class RedisConnection extends EventEmitter {
	/** Redis接続設定。 */
	public readonly config: IRedisConfig;
	/** 接続先のキー。 */
	public readonly key: string;
	/** サブスクライブ用Redisクライアント。 */
	private sub: IRedisClientAsync;
	/** 通信ロガー */
	public logger = (level: string, message: string) => console.log(message);

	/**
	 * 指定されたキーでコネクションを作成する。
	 * @param config Redis接続設定。
	 * @param key pub/subするキー。
	 * @param options オプション。
	 */
	constructor(config: IRedisConfig, key: string, options: RedisConnectionOptions = {}) {
		super();

		this.config = config;
		this.key = key;

		// イベント系はプロパティで登録だが、ロガーだけはコンストラクタでも使用するため、
		// オプションでも指定できるようにする
		if (options.logger) {
			this.logger = options.logger;
		}

		this.subscribe();
	}

	/**
	 * 購読を開始する。
	 */
	private subscribe(): void {
		this.sub = createClient(this.config);
		this.sub.on('message', (channel, message) => {
			this.logger('info', `MESSAGE ch=${channel}, msg=${message}`);
			this.emit('message', message, this);
		});
		this.sub.on('subscribe', (channel, count) => {
			this.logger('info', `SUBSCRIBE ch=${channel}, count=${count}`);
			this.emit('subscribe', count, this);
		});
		this.sub.on('unsubscribe', (channel, count) => {
			this.logger('info', `UNSUBSCRIBE ch=${channel}, count=${count}`);
			this.emit('unsubscribe', count, this);
			this.sub.quit();
		});
		this.sub.on('error', (err) => {
			this.logger('error', `ERROR ${err}`);
			this.emit('error', err, this);
			this.sub.quit();
		});
		this.sub.subscribe(this.key);
	}

	/**
	 * 購読を取り止める。
	 */
	public unsubscribe(): void {
		this.sub.unsubscribe();
		this.sub = null;
	}

	/**
	 * メッセージを送信する。
	 * @param data 送信するデータ。
	 * @param toJson JSONに変換する場合true。デフォルトtrue。
	 * @return 処理状態。
	 */
	public async publish(data: any, toJson: boolean = true): Promise<void> {
		// ※ 大量にpublishする場合は、クライアントを使い回すよう改造検討
		const pub = createClient(this.config);
		let message = data;
		if (toJson) {
			message = JSON.stringify(data);
		}
		await pub.publishAsync(this.key, message);
		this.logger('info', `PUBLISH ch=${this.key}, msg=${message}`);
		pub.quit();
	}

	// イベント定義
	emit(event: 'message', message: string, connection: RedisConnection): boolean;
	emit(event: 'subscribe' | 'unsubscribe', count: number, connection: RedisConnection): boolean;
	emit(event: 'error', err: Error, connection: RedisConnection): boolean;
	emit(event: string | symbol, ...args: any[]): boolean {
		return super.emit(event, ...args);
	}
	on(event: 'message', listener: (message: string, connection: RedisConnection) => void): this;
	on(event: 'subscribe' | 'unsubscribe', listener: (count: number, connection: RedisConnection) => void): this;
	on(event: 'error', listener: (err: Error, connection: RedisConnection) => void): this;
	on(event: string | symbol, listener: (...args: any[]) => void): this {
		return super.on(event, listener);
	}
	once(event: 'message', listener: (message: string, connection: RedisConnection) => void): this;
	once(event: 'subscribe' | 'unsubscribe', listener: (count: number, connection: RedisConnection) => void): this;
	once(event: 'error', listener: (err: Error, connection: RedisConnection) => void): this;
	once(event: string | symbol, listener: (...args: any[]) => void): this {
		return super.once(event, listener);
	}
	removeListener(event: 'message', listener: (message: string, connection: RedisConnection) => void): this;
	removeListener(event: 'subscribe' | 'unsubscribe', listener: (count: number, connection: RedisConnection) => void): this;
	removeListener(event: 'error', listener: (err: Error, connection: RedisConnection) => void): this;
	removeListener(event: string | symbol, listener: (...args: any[]) => void): this {
		return super.removeListener(event, listener);
	}
}
