/**
 * データモデル抽象クラスモジュール。
 * @module ./core/db/data-model
 */
import { Model, DefaultScope, IFindOptions } from 'sequelize-typescript';
import { NotFoundError } from '../../core/errors';

/**
 * データモデル抽象クラス。
 * 各テーブルで汎用の仕組みやメソッドを定義する。
 */
@DefaultScope({
	// デフォルトではIDでソートされる
	order: [
		['id', 'ASC'],
	],
})
export default abstract class DataModel<T extends DataModel<T>> extends Model<T> {
	/**
	 * レコードを主キーで取得する。
	 * @param identifier テーブルの主キー。
	 * @param options 検索オプション。
	 * @returns レコード。
	 * @throws NotFoundError レコードが存在しない場合。
	 */
	static async findOrFail<T extends DataModel<T>>(this: (new () => T), identifier: number | string, options?: IFindOptions<T>): Promise<T> {
		const instance = await (this as any).findById(identifier, options);
		if (!instance) {
			throw new NotFoundError(this.name, identifier);
		}
		return instance;
	}
}
