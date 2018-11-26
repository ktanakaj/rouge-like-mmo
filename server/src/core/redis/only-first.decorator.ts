/**
 * 多対多通信の排他用デコレーターモジュール。
 * @module ./core/redis/only-first.decorator
 */
import 'reflect-metadata';
import * as config from 'config';
import { NoResponse } from 'json-rpc2-implementer';
import { IRedisConfig } from './redis-helper';
import { lockRequest } from './redis-rpc-server';

/**
 * 多対多通信の排他制御用メソッドデコレーター。
 * マイクロサービスのメソッドに付けると、ロックが取れたサーバーのみが実行される。
 * @param options 排他制御設定。
 * @returns デコレーターファクトリー。
 */
export function OnlyFirst(options: { config?: IRedisConfig, timeout?: number }): Function;
/**
 * 多対多通信の排他制御用メソッドデコレーター。
 * マイクロサービスのメソッドに付けると、ロックが取れたサーバーのみが実行される。
 * @param target クラスのプロトタイプ。
 * @param propertyKey メソッド名。
 * @param descriptor メソッドのプロパティディスクリプタ。
 * @returns 排他制御でラップしたプロパティディスクリプタ。
 */
export function OnlyFirst(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
export function OnlyFirst(targetOrOptions: any, propertyKey?: string, descriptor?: PropertyDescriptor): PropertyDescriptor | Function {
	// ※ Redisアクセスの都合上、戻り値はPromiseとなります。
	if (propertyKey) {
		return OnlyFirst({})(targetOrOptions, propertyKey, descriptor);
	} else {
		// TODO: ライブラリ的なモジュールにするために、configのデフォルトも外から注入する形にして結合度を下げたい
		const conf = targetOrOptions.config || config['redis']['redis'];
		const timeout = targetOrOptions.timeout;
		return (target: any, propKey: string, desc: PropertyDescriptor): PropertyDescriptor => {
			const func = desc.value;
			if (typeof func !== 'function') {
				throw new Error(`${propKey} is not function`);
			}
			// 排他制御でラップしたメソッドを返す
			// ※ functionにしているのは、本来のthisを参照させるため
			const wrapped = async function (params, connection, id) {
				const locked = await lockRequest(conf, id, timeout);
				if (!locked) {
					return NoResponse;
				}
				return await func.apply(this, arguments);
			};
			return Object.assign(desc, {
				value: wrapped,
			});
		};
	}
}
