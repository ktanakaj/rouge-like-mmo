/**
 * シャーディングDB用のデータモデル抽象クラスモジュール。
 * @module ./core/models/shardable-data-model
 */
import { DefaultScope, IFindOptions } from 'sequelize-typescript';
import { NotFoundError } from '../../core/errors';
import ShardableModel from './shardable-model';

/**
 * シャーディングDB用のデータモデル抽象クラス。
 * 各テーブルで汎用の仕組みやメソッドを定義する。
 */
@DefaultScope({
	// デフォルトではIDでソートされる
	order: [
		['id', 'ASC'],
	],
})
export default abstract class ShardableDataModel<T extends ShardableModel<T>> extends ShardableModel<T> {
	/**
	 * レコードを主キーで取得する。
	 * @param identifier テーブルの主キー。
	 * @param options 検索オプション。
	 * @returns レコード。
	 * @throws NotFoundError レコードが存在しない場合。
	 */
	static async findOrFail<T extends ShardableModel<T>>(this: (new () => T), identifier: number | string, options?: IFindOptions<T>): Promise<T> {
		const instance = await (this as any).findById(identifier, options);
		if (!instance) {
			throw new NotFoundError(this.name, identifier);
		}
		return instance;
	}
}
