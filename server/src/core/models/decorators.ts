/**
 * モデル用カスタムデコレーターモジュール。
 * @module ./core/models/decorators
 */
import 'reflect-metadata';
import { Table as SequelizeTable } from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';
import * as config from 'config';
import { getCacheStore } from './cache-store';

/** DB情報用のキー */
export const DB_KEY = Symbol('db');

/**
 * 拡張Tableデコレーター。
 * 標準のTableデコレーターに、DBの設定を追加している。
 * @param options テーブル定義。
 * @returns デコレーターファクトリー。
 */
export function Table(options: IDefineOptions & { db: string }): Function {
	return (target: any) => {
		Reflect.defineMetadata(DB_KEY, options.db, target);
		(SequelizeTable(options) as any)(target);
	};
};

/**
 * キャッシュ用デコレーター。
 * メソッドに付けると、その戻り値をキャッシュする。
 * @param options キャッシュ設定。
 * @returns デコレーターファクトリー。
 */
export function Cache(options: { ttl?: number, factory?: (json) => any }): Function;
/**
 * キャッシュ用デコレーター。
 * メソッドに付けると、その戻り値をキャッシュする。
 * @param options キャッシュ設定。
 * @returns デコレーターファクトリー。
 */
export function Cache(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
export function Cache(targetOrOptions: any, propertyKey?: string, descriptor?: PropertyDescriptor): PropertyDescriptor | Function {
	// ※ キャッシュストアとしてRedisを使用。JSONでキャッシュするため、
	//    初期状態ではクラス情報などは失われます。
	//    クラスのインスタンス等として復元する場合は、factoryを指定してください。
	// ※ キャッシュの一意条件に、thisの状態は含まれません。
	// ※ Redisアクセスの都合上、戻り値はPromiseとなります。
	// ※ デコレーターの仕組み上、親クラスのstaticメソッドに付けても子クラスのクラス名が取れません。
	//    子クラス側でオーバーライドするか、独自に実装してください。
	if (propertyKey) {
		return Cache({})(targetOrOptions, propertyKey, descriptor);
	} else {
		return (target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
			if (typeof descriptor.value !== 'function') {
				throw new Error(`${propertyKey} is not function`);
			}
			// キャッシュ処理でラップしたメソッドを返す
			const name = typeof target === 'function' ? target.name : target.constructor.name;
			const cachedfunc = getCacheStore(config['redis']['cache']).wrap(descriptor.value, Object.assign({
				prefix: name + ':' + propertyKey,
			}, targetOrOptions));
			return Object.assign(descriptor, {
				value: cachedfunc,
			});
		};
	}
}
