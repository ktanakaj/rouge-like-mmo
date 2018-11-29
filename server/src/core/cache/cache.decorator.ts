/**
 * キャッシュデコレーターモジュール。
 * @module ./core/cache/cache.decorator
 */
import 'reflect-metadata';
import * as config from 'config';
import { getCacheStore } from './cache-store';

/**
 * キャッシュ用メソッドデコレーター。
 * メソッドに付けると、その戻り値をキャッシュする。
 * @param options キャッシュ設定。
 * @returns デコレーターファクトリー。
 */
export function Cache(options: { ttl?: number, factory?: (json) => any }): Function;
/**
 * キャッシュ用メソッドデコレーター。
 * メソッドに付けると、その戻り値をキャッシュする。
 * @param target クラスのコンストラクタorプロトタイプ。
 * @param propertyKey メソッド名。
 * @param descriptor メソッドのプロパティディスクリプタ。
 * @returns キャッシュ処理でラップしたプロパティディスクリプタ。
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
	// TODO: ライブラリ的なモジュールにするために、configは外から注入する形にして結合度を下げたい
	const redisConfig = config['redis']['cache'];
	if (propertyKey) {
		return Cache({})(targetOrOptions, propertyKey, descriptor);
	} else {
		return (target: any, propKey: string, desc: PropertyDescriptor): PropertyDescriptor => {
			if (typeof desc.value !== 'function') {
				throw new Error(`${propKey} is not function`);
			}
			// キャッシュ処理でラップしたメソッドを返す
			const name = typeof target === 'function' ? target.name : target.constructor.name;
			const cachedfunc = getCacheStore(redisConfig).wrap(desc.value, Object.assign({
				prefix: name + ':' + propKey,
			}, targetOrOptions));
			return Object.assign(desc, {
				value: cachedfunc,
			});
		};
	}
}
