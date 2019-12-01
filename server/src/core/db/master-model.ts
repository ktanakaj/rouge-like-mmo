/**
 * マスタモデル抽象クラスモジュール。
 * @module ./core/db/master-model
 */
import { Column, Model, PrimaryKey, Comment, DefaultScope, BeforeValidate, getAttributes } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
import { ApiProperty } from '@nestjs/swagger';
import * as Bluebird from 'bluebird';
import * as config from 'config';
import { NotFoundError } from '../../core/errors';
import { getCacheStore } from '../cache';

/**
 * マスタモデル抽象クラス。
 *
 * 各マスタで汎用の仕組みやメソッドを定義する。
 */
@DefaultScope({
	// デフォルトではIDでソートされる
	order: [
		['id', 'ASC'],
	],
})
export default abstract class MasterModel<T extends MasterModel<T> = any> extends Model<T> {
	/** デフォルトのキャッシュ保持期間（秒） */
	private static readonly DEFAULT_TTL = 86400;

	/** マスタID。デフォルトだと自動採番のID列が作られてしまうため上書き。 */
	@ApiProperty({ description: 'マスタID', type: 'integer' })
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

	// ※ オーバーライド系メソッドなど、うまく型が取れない部分が多々ありanyで誤魔化している
	//    このクラスは共通関数なので、使う側に影響がなければ許容する。

	/**
	 * 全てのレコードを取得する。
	 * FIXME: thisの型をModel由来のものに直したいが、コンパイルが通らないため一旦anyで騙している。要修正
	 * @param options 検索オプション。
	 * @returns レコード配列。※キャッシュ有
	 */
	public static findAll(this: any, options?: FindOptions): Bluebird<any[]> {
		// ※ findByPk, findOne 等も最終的に findAll を呼んでいるため、全てキャッシュされます
		// ※ マスタモデルは単純な使い方しか想定していないため、複雑なoptionsを指定した場合、
		//    キャッシュが正常に機能しない可能性があります。
		const self: any = this;
		let factory;
		if (!options || !options.raw) {
			factory = (json) => {
				if (json === undefined || json === null) {
					return json;
				}
				return Array.isArray(json) ? json.map((m) => self.build(m)) : self.build(json);
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
	public static async findOrFail<M extends MasterModel>(
		this: (new () => M) & typeof MasterModel, identifier: number | string, options?: FindOptions): Promise<M> {

		const instance = await this.findByPk(identifier, options);
		if (!instance) {
			throw new NotFoundError(this.name, identifier);
		}
		return instance as any;
	}

	/**
	 * 有効期間内の全てのレコードを取得する。
	 * @param options 検索オプション。
	 * @returns レコード配列。
	 */
	public static async findAllWithIsActive<M extends MasterModel>(this: (new () => M) & typeof MasterModel, options?: FindOptions): Promise<M[]> {
		const instances = await this.findAll(options);
		return instances.filter((m) => m.isActive());
	}

	/**
	 * 有効期間内のマスタを主キーで取得する。
	 * @param identifier マスタの主キー。
	 * @param options 検索オプション。
	 * @returns マスタ。
	 * @throws NotFoundError マスタが存在しないまたは期間外の場合。
	 */
	public static async findOrFailWithIsActive<M extends MasterModel>(
		this: (new () => M) & typeof MasterModel, identifier: number | string, options?: FindOptions): Promise<M> {

		const instance = await this.findOrFail(identifier, options);
		if (!instance.isActive()) {
			throw new NotFoundError(this.name, identifier);
		}
		return instance as any;
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
	static cachewarp(name: string, factory: (json) => any): Function {
		return getCacheStore(config['redis']['cache']).wrap(
			super[name],
			{
				ttl: MasterModel.DEFAULT_TTL,
				factory,
				prefix: this.name + ':' + name,
			});
	}
}
