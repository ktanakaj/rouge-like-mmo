/**
 * JSON-RPC2 on Redis pubsubのマイクロサービスストラテジークライアントモジュール。
 * @module ./core/redis/redis-rpc-client.ts
 */
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';
import { EventEmitter } from 'events';
import { NoResponse } from 'json-rpc2-implementer';
import { IRedisConfig } from './redis-helper';
import { RedisRpcConnection } from './redis-rpc-connection';
import { DEFAULT_KEY } from './redis-rpc-server';

export interface RedisRpcClientConfig {
	/** Subscribeするキー。 */
	key?: string;
	/** Redis pub/sub用のロガー */
	logger?: (level, message) => {};
}

/**
 * JSON-RPC2 on Redis pubsubのマイクロサービスストラテジークライアントクラス。
 */
export class RedisRpcClient extends ClientProxy {
	/** Redis pub/subによるコネクション。 */
	private connection: RedisRpcConnection = null;
	/** Redis接続設定値。 */
	private redis: IRedisConfig;
	/** イベント管理用エミッター ※多重継承できないためプロパティとして保持 */
	private ev = new EventEmitter();

	/**
	 * 指定されたRedisでpubsubするストラテジーを生成する。
	 * @param server Redis接続用の情報。
	 * @param config 追加の設定。
	 */
	constructor(redis: IRedisConfig, private readonly config: RedisRpcClientConfig = {}) {
		super();
		this.redis = redis;
		this.config = config;
		if (!config.key) {
			this.config.key = DEFAULT_KEY;
		}
	}

	/**
	 * 接続を開始する。
	 * @returns 処理状態。
	 */
	async connect(): Promise<void> {
		// ※ 現状だと、サーバーとクライアントで同じRedisでも2本のコネクションが生成される。
		//    どこかにプールして一本にしてもいいかも。
		const options = {};
		if (this.config.logger) {
			// ログそのままだとServer/Client混在時に分かり辛いので付ける
			options['logger'] = (level, message) => this.config.logger(level, `${message} #client`);
		}
		const conn = new RedisRpcConnection(this.redis, this.config.key, Object.assign({
			// pub/subなのでサーバー用のリクエストが届いてしまう場合があるが、クライアント用の接続なので無視する
			methodHandler: () => NoResponse,
		}, options));
		conn.on('error', (err) => this.emit('error', err));
		this.connection = conn;
	}

	/**
	 * 接続をクローズする。
	 */
	close(): void {
		this.connection && this.connection.unsubscribe();
		this.connection = null;
	}

	/**
	 * パケットを送信する。
	 * @param packet 送信パケット。
	 * @param callback レスポンスを受け取るコールバック。
	 */
	protected publish(packet: ReadPacket, callback: (packet: WritePacket) => void): void {
		if (!this.connection) {
			return callback({ err: new Error('Connection is closed') });
		}
		try {
			this.connection.call(packet.pattern, packet.data)
				.then((response) => {
					// 一行目がObservableのOnNextで、二行目がOnComplete
					// ※ 複数のサーバーが値を返すことも出来るが、とりあえず最初に返ってきた値を使用する
					//    （何件あるのか分からないし。）
					callback({ response });
					callback({ isDisposed: true });
				})
				.catch((err) => callback({ err }));
		} catch (err) {
			callback({ err });
		}
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
