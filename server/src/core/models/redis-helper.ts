/**
 * Redisの各種共通処理モジュール。
 * @module ./core/models/redis-helper
 */
import * as redis from 'redis';
import * as redisAsync from 'redis-promisify';
import * as log4js from 'log4js';

const debugLogger = log4js.getLogger('debug');
const errorLogger = log4js.getLogger('error');

export interface IRedisClientAsync extends redis.RedisClient {
	// ※ 現状一部しか定義されていません。必要に応じて追加してください。
	// ※ 配列などで渡しても動くが、現状は単純な引数のみ対応。
	multi(): IRedisMultiAsync;
	quitAsync(): Promise<void>;
	echoAsync(): Promise<string>;
	existsAsync(key: string): Promise<number>;
	delAsync(key: string): Promise<number>;
	typeAsync(key: string): Promise<string>;
	keysAsync(pattern: string): Promise<string[]>;
	expireAsync(key: string, seconds: number): Promise<number>;
	flushdbAsync(): Promise<string>;
	zaddAsync(key: string, score: number, member: string): Promise<number>;
	zremAsync(key: string, member: string): Promise<number>;
	zcardAsync(key: string): Promise<number>;
	zcountAsync(key: string, min: number | string, max: number | string): Promise<number>;
	zincrbyAsync(key: string, increment: number, member: string): Promise<number>;
	zrangeAsync(key: string, start: number, stop: number, withscores?: 'WITHSCORES'): Promise<string[]>;
	zrevrangeAsync(key: string, start: number, stop: number, withscores?: 'WITHSCORES'): Promise<string[]>;
	zrankAsync(key: string, member: string): Promise<number | void>;
	zrevrankAsync(key: string, member: string): Promise<number | void>;
	zscoreAsync(key: string, member: string): Promise<string>;
	hsetAsync(key: string, field: string, value: string): Promise<number>;
	hsetnxAsync(key: string, field: string, value: string): Promise<number>;
	hgetAsync(key: string, field: string): Promise<string>;
	hdelAsync(key: string, field: string): Promise<number>;
	hgetallAsync(key: string): Promise<{ [key: string]: string }>;
	monitorAsync(): Promise<void>;
}

export interface IRedisMultiAsync extends redis.Multi {
	execAsync(): Promise<any[]>;
}

/**
 * Redisクライアントを作成する。
 *
 * ※ pub/subなどクライアントを占有してしまう場合を想定。
 *    通常の更新系なら getClient() でOK。
 * ※ 使い終わったら必ず client.quit() を実行してください。
 * @param config Redis設定。
 * @returns Redisクライアント。
 */
export function createClient(config: { host: string, port: number, options?: object }): IRedisClientAsync {
	const client = redisAsync.createClient(
		config.port,
		config.host,
		config.options,
	);
	client.on('error', (err) => errorLogger.error(err));
	return client;
}

/** Redisクライアントプール */
const pool = new Map();

/**
 * Redisクライアントを取得する。
 * @param config Redis設定。
 * @returns Redisクライアント。
 */
export function getClient(config: { host: string, port: number, options?: object }): IRedisClientAsync {
	// 取得済みのインスタンスがある場合は取得する
	// ※ 現状、接続先ごとに1クライアント保持しているのみで、複数のクライアントを保持するコネクションプール的な事はしていない
	const key = JSON.stringify(config);
	if (pool.has(key)) {
		return pool.get(key);
	}
	// 初回は切断対策のイベントなどを埋め込む
	// ※ 切断時はpoolから消して再接続を促す
	const client = createClient(config);
	client.on('end', () => {
		client.quitAsync().catch((e) => errorLogger.error(e));
		pool.delete(key);
	});
	client.on('error', () => {
		if (!client.connected) {
			client.quitAsync().catch((e) => errorLogger.error(e));
			pool.delete(key);
		}
	});
	pool.set(key, client);
	return client;
}

/** Redisモニター用クライアントプール */
const monitorPool = new Map();

/**
 * 指定されたRedisでコマンドを監視する。※開発用
 * @param config Redis設定。
 * @returns 処理状態。
 */
export async function startMonitoring(config: { host: string, port: number }): Promise<void> {
	// ※ 1サーバーに1つで十分なので、ホスト名:ポート番号だけで重複チェック
	const key = `${config.host}:${config.port}`;
	if (monitorPool.has(key)) {
		return;
	}
	// 作成したクライアントは一応プールに入れておく
	const client = createClient(config);
	await client.monitorAsync();
	// ※ monitorコマンドを使用しているため、アプリ外のRedisコマンドログも出力されます
	client.on('monitor', (time, args) => {
		debugLogger.trace('Executing (redis): ' + args.join(' '));
	});
	monitorPool.set(key, client);
}
