/**
 * キャッシュストアモジュール。
 * @module ./core/cache/cache-store
 */
import * as crypto from 'crypto';
import { getClient, IRedisClientAsync, IRedisConfig } from '../redis';

/**
 * Redisによるキャッシュストアクラス。
 */
export class CacheStore {
	/** デフォルトのキャッシュ保持期間（秒） */
	private static readonly DEFAULT_TTL = 3600;

	/** キャッシュ格納先とのRedisクライアント。 */
	private client: IRedisClientAsync;

	/**
	 * 指定されたRedisを使用するキャッシュストアを生成する。
	 * @param config Redis設定。
	 */
	constructor(config: IRedisConfig) {
		this.client = getClient(config);
	}

	/**
	 * キャッシュされたデータを取得する。
	 * @param key キャッシュキー。
	 * @param options キャッシュ取得条件。
	 * @returns キャッシュデータ、またはキャッシュデータと状態。
	 */
	async get(key: string, options: { dataOnly?: boolean } = {}): Promise<any | { data: any, cached: boolean }> {
		const s = await this.client.getAsync(key);
		const result = { data: null, cached: false };
		if (s !== undefined && s !== null) {
			// 必ず配列で保存しているはずなので、そこから値を取り出す
			const json = JSON.parse(s);
			if (Array.isArray(json)) {
				result.cached = true;
				result.data = json[0];
			}
		}
		return options.dataOnly ? result.data : result;
	}

	/**
	 * キャッシュにデータを保存する。
	 * @param key キャッシュキー。
	 * @param value キャッシュデータ。※JSONに変換されます
	 * @param options キャッシュ保存条件。
	 * @returns 処理状態。
	 */
	async set(key: string, value: any, options: { ttl?: number } = {}): Promise<void> {
		// ※ undefinedやnull時にキャッシュの有無が一コマンドで判断できるよう配列に包む
		await this.client.setAsync(key, JSON.stringify([value]));
		await this.client.expireAsync(key, options.ttl || CacheStore.DEFAULT_TTL);
	}

	/**
	 * キャッシュを削除する。
	 * @param key キャッシュキー。まとめて消す場合は '*' が指定可（例 'findById:*'）。
	 * @returns 処理状態。
	 */
	async delete(key: string): Promise<void> {
		await this.client.delAsync(key);
	}

	/**
	 * 渡された関数をキャッシュ処理でラップする。
	 * @param func ラップする関数。
	 * @param options 追加情報。
	 * @returns ラップされた関数。
	 */
	wrap(func: () => Promise<any>, options: { ttl?: number, factory?: (json) => any, prefix?: string } = {}): () => Promise<any> {
		// ※ 戻り値をわざわざselfが必要なfunctionにしているのは、クラスメソッドの場合にfuncと同じ用に動作させるため
		const self = this;
		// ※ funcはtoString()するとソースコードで一意だが長いので適当なハッシュに変換
		const prefix = (options.prefix ? options.prefix : crypto.createHash('md5').update(String(func)).digest('hex')) + ':';

		return async function () {
			// ※ 引数が大きくなる傾向がある場合、引数もMD5なりにする
			const key = prefix + JSON.stringify(Array.from(arguments));
			const cache = await self.get(key);
			if (cache.cached) {
				return await options.factory ? options.factory(cache.data) : cache.data;
			}
			const value = await func.apply(this, arguments);
			await self.set(key, value, options);
			return value;
		};
	}
}

/** キャッシュストアプール */
const pool = new Map();

/**
 * キャッシュストアを取得する。
 * @param config Redis設定。
 * @returns キャッシュストア。
 */
export function getCacheStore(config: IRedisConfig): CacheStore {
	// 取得済みのインスタンスがある場合は取得する
	// ※ 現状の実装だと、別にインスタンスを使い回さなくても問題ないが、
	//    キャッシュ実装によっては変わってくるかもしれないので。
	const key = JSON.stringify(config);
	if (!pool.has(key)) {
		pool.set(key, new CacheStore(config));
	}
	return pool.get(key);
}
