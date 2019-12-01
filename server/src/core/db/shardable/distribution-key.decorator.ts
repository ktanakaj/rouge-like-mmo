/**
 * シャーディングキー指定用デコレーターモジュール。
 * @module ./core/db/shardable/distribution-key.decorator
 */
import 'reflect-metadata';

/** シャーディングキー情報のキー */
export const DISTRIBUTION_KEY = Symbol('distributionKey');

/**
 * シャーディングキー指定用プロパティデコレーター。
 * Modelクラスで、シャーディングキーにしたい列のプロパティに設定する。
 * @param target クラスのプロトタイプ。
 * @param propertyName プロパティ名。
 */
export function DistributionKey(target: any, propertyName: string): void {
	Reflect.defineMetadata(DISTRIBUTION_KEY, propertyName, target.constructor);
}
