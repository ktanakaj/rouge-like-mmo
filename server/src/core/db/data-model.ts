/**
 * データモデル抽象クラスモジュール。
 * @module ./core/db/data-model
 */
import { Model, DefaultScope } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
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
export default abstract class DataModel<T extends DataModel<T> = any> extends Model<T> {
	/**
	 * レコードを主キーで取得する。
	 * @param identifier テーブルの主キー。
	 * @param options 検索オプション。
	 * @returns レコード。
	 * @throws NotFoundError レコードが存在しない場合。
	 */
	public static async findOrFail<M extends DataModel>(
		this: (new () => M) & typeof DataModel, identifier: number | string, options?: FindOptions): Promise<M> {

		const instance = await this.findByPk(identifier, options);
		if (!instance) {
			throw new NotFoundError(this.name, identifier);
		}
		return instance as any;
	}
}
