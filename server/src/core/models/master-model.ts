/**
 * マスタモデル抽象クラスモジュール。
 * @module ./core/models/master-model
 */
import { Column, Model, PrimaryKey, Comment, DefaultScope, BeforeValidate, IFindOptions } from 'sequelize-typescript';
import { getAttributes } from 'sequelize-typescript/lib/services/models';
import { ApiModelProperty } from '@nestjs/swagger';
import { NotFoundError } from '../../core/errors';
import invokeContext from '../../shared/invoke-context';

/**
 * マスタモデル抽象クラス。
 *
 * 各マスタで汎用の仕組みやメソッドを定義する。
 * マスタはテーブルとモデルが一対一ではなく、バージョンごとに別々のテーブルに
 * インポートされて運用される。
 * （例）contestマスタの実際のテーブルは contests_v11 のようになる。）
 */
@DefaultScope({
	// デフォルトではIDでソートされる
	order: [
		['id', 'ASC'],
	],
})
export default abstract class MasterModel<T extends MasterModel<T>> extends Model<T> {
	/** マスタID。デフォルトだと自動採番のID列が作られてしまうため上書き。 */
	@ApiModelProperty({ description: 'マスタID', type: 'integer' })
	@PrimaryKey
	@Comment('マスタID')
	@Column
	id: number;

	/**
	 * マスタが有効期間内か？
	 * @returns 有効期間内の場合true。
	 */
	isActive(): boolean {
		// 有効期間的なプロパティがある場合のみチェック
		// （有効期間的なプロパティの種類が増えたら追加してください）
		const now = Date.now();
		if (this['openAt'] instanceof Date && now < this['openAt'].getTime()) {
			return false;
		}
		if (this['closeAt'] instanceof Date && now > this['closeAt'].getTime()) {
			return false;
		}
		return true;
	}

	/**
	 * モデルのテーブル名を取得する。
	 * @returns テーブル名またはテーブル情報のオブジェクト。
	 */
	static getTableName(): string | object {
		// マスタバージョンに応じて動的にテーブル名を変えるためにsequelizeのModelのメソッドをオーバーライド
		const version = invokeContext.getMasterVersion();
		if (!version) {
			throw new NotFoundError('There are no available master version');
		}
		const versionSuffix = '_v' + version;
		const schema = (this as any).QueryGenerator.addSchema(this);
		if (typeof schema === 'string') {
			return schema + versionSuffix;
		}
		if (schema['tableName']) {
			schema['tableName'] = schema['tableName'] + versionSuffix;
		}
		if (schema['table']) {
			schema['table'] = schema['table'] + versionSuffix;
		}
		return schema;
	}

	/**
	 * マスタを主キーで取得する。
	 * @param identifier マスタの主キー。
	 * @param options 検索オプション。
	 * @returns マスタ。
	 * @throws NotFoundError マスタが存在しない場合。
	 */
	static async findOrFail<T extends MasterModel<T>>(this: (new () => T), identifier: number | string, options?: IFindOptions<T>): Promise<T> {
		const instance = await (this as any).findById(identifier, options);
		if (!instance) {
			throw new NotFoundError(this.name, identifier);
		}
		return instance;
	}

	/**
	 * 有効期間内のマスタを主キーで取得する。
	 * @param identifier マスタの主キー。
	 * @param options 検索オプション。
	 * @returns マスタ。
	 * @throws NotFoundError マスタが存在しないまたは期間外の場合。
	 */
	static async findOrFailWithIsActive<T extends MasterModel<T>>(
		this: (new () => T), identifier: number | string, options?: IFindOptions<T>): Promise<T> {

		const instance = await (this as any).findOrFail(identifier, options);
		if (!instance.isActive()) {
			throw new NotFoundError(this.name, identifier);
		}
		return instance;
	}

	/**
	 * 日付型パラメータのtrim処理。
	 * @param instance trimするインスタンス。
	 */
	@BeforeValidate
	static trimDateParameters(instance: MasterModel<any>): void {
		// マスタはCSV等から読み込むため、Date型列では空文字列をnullとして扱う
		const attributes = getAttributes(instance);
		for (const key in attributes) {
			if (attributes[key].type.key === 'DATE') {
				if (instance[key] === '') {
					instance[key] = null;
				}
			}
		}
	}
}
