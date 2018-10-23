/**
 * マスタモデル抽象クラスモジュール。
 * @module ./core/models/master-model
 */
import { Column, Model, PrimaryKey, Comment, DefaultScope, BeforeValidate, IFindOptions } from 'sequelize-typescript';
import { getAttributes } from 'sequelize-typescript/lib/services/models';
import { NonAbstract } from 'sequelize-typescript/lib/utils/types';
import { ApiModelProperty } from '@nestjs/swagger';
import * as Bluebird from 'bluebird';
import * as config from 'config';
import { NotFoundError } from '../../core/errors';
import invokeContext from '../../shared/invoke-context';
import { getCacheStore } from './cache-store';

/** モデル型定義。typeof T がコンパイルエラーになるのでその代替。 */
type NonAbstractTypeOfMasterModel<T> = (new () => T) & NonAbstract<typeof MasterModel>;

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
	/** デフォルトのキャッシュ保持期間（秒） */
	private static readonly DEFAULT_TTL = 86400;

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
	public isActive(): boolean {
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
	 * 全てのレコードを取得する。
	 * @param options 検索オプション。
	 * @returns レコード配列。※キャッシュ有
	 */
	public static findAll<T>(this: NonAbstractTypeOfMasterModel<T>, options?: IFindOptions<T>): Bluebird<T[]> {
		// ※ findById, findOne 等も最終的に findAll を呼んでいるため、全てキャッシュされます
		// ※ マスタモデルは単純な使い方しか想定していないため、複雑なoptionsを指定した場合、
		//    キャッシュが正常に機能しない可能性があります。
		const self: any = this;
		let factory;
		if (!options || !options.raw) {
			factory = (json) => {
				if (json === undefined || json === null) {
					return json;
				}
				return Array.isArray(json) ? json.map((m) => self.build(m)) : self.build(json)
			};
		}
		return this.cachewarp('findAll', factory).apply(this, arguments);
	}

	/**
	 * マスタを主キーで取得する。
	 * @param identifier マスタの主キー。
	 * @param options 検索オプション。
	 * @returns マスタ。
	 * @throws NotFoundError マスタが存在しない場合。
	 */
	public static async findOrFail<T extends MasterModel<T>>(this: NonAbstractTypeOfMasterModel<T>, identifier: number | string, options?: IFindOptions<T>): Promise<T> {
		const instance = await this.findById(identifier, options);
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
	public static async findOrFailWithIsActive<T extends MasterModel<T>>(
		this: NonAbstractTypeOfMasterModel<T>, identifier: number | string, options?: IFindOptions<T>): Promise<T> {

		const instance = await this.findOrFail(identifier, options);
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

	/**
	 * マスタモデルのメソッドをキャッシュ処理でラップする。
	 * @param name ラップするメソッド名。
	 * @param factory キャッシュをモデルに復元するための処理。
	 * @returns ラップされたメソッド。
	 */
	static cachewarp<T>(this: NonAbstractTypeOfMasterModel<T>, name: string, factory: (json) => any): Function {
		return getCacheStore(config['redis']['cache']).wrap(
			super[name],
			{
				ttl: MasterModel.DEFAULT_TTL,
				factory,
				prefix: 'v' + invokeContext.getMasterVersion() + ':' + this.name + ':' + name,
			}
		);
	}
}
