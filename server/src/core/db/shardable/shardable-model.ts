/**
 * sequelize-typescriptのモデルをシャーディング環境用に拡張したモデルモジュール。
 * @module ./core/db/shardable/shardable-model
 */
import { Sequelize, Model } from 'sequelize-typescript';
import {
	FindOptions, CountOptions, FindAndCountOptions, BuildOptions, CreateOptions, FindOrCreateOptions,
	UpsertOptions, TruncateOptions, IncrementDecrementOptionsWithBy,
} from 'sequelize';
import * as _ from 'lodash';
import * as Bluebird from 'bluebird';

/**
 * sequelize-typescriptのモデルをシャーディング環境用に拡張したモデルクラス。
 *
 * 標準のモデルクラスはそのままでは複数のDBに紐づけないので、
 * シャーディング情報を扱うラッパーで包む形で拡張して、間接的に使用する。
 *
 * ※ このモデルは、以下の2パターンで使用されます。
 *      a) 全DBと紐づいた通常のモデル
 *      b) 個別のシャードとのみ紐づいた動的なモデル（shard()メソッドで取得可能）
 *    前者においては、Sequelize標準のモデルのstaticメソッドは無効化されます。
 *    このクラスで定義している互換メソッドを使用してください。
 */
export default abstract class ShardableModel<T extends ShardableModel<T> = any> extends Model<T> {
	/** モデルが紐づくSequelizeインスタンス */
	public static sequelizes: Sequelize[];

	/** シャーディングのキーとなる列 */
	public static distributionKey: string = 'id';

	/**
	 * シャーディングキーの値から対応するDB番号を取得する。
	 * @param distributionValue シャーディングキーの値。
	 * @returns 対応するDB番号。
	 * @throws Error Sequelizeが初期化されていない場合。
	 */
	public static shardNo(distributionValue: number): number {
		// ※ ごくごく簡単な実装。できればCRC32などを使って数値以外でも対応できるようにする
		// ※ DB数が変化するとずれるので増設時は要注意
		if (this.sequelizes.length === 0) {
			throw new Error('Sequelize instances is empty.');
		}
		return distributionValue % this.sequelizes.length;
	}

	/**
	 * シャーディングキーの値から対応するsequelizeインスタンスを取得する。
	 * @param distributionValue シャーディングキーの値。
	 * @returns 対応するsequelizeインスタンス。
	 */
	public static shardDb(distributionValue: number): Sequelize {
		return this.sequelizes[this.shardNo(distributionValue)];
	}

	// ※ オーバーライド系メソッドなど、うまく型が取れない部分が多々ありanyで誤魔化している
	//    このクラスは共通関数なので、使う側に影響がなければ許容する。

	/**
	 * シャーディングキーの値から対応するsequelizeモデルクラスを取得する。
	 * @param distributionValue シャーディングキーの値。
	 * @returns 対応するsequelizeモデルクラス。
	 */
	public static shard<M extends ShardableModel>(
		this: (new () => M) & typeof ShardableModel, distributionValue: number): (new () => M) & typeof ShardableModel {

		return this.shardDb(distributionValue).model(this.name) as any;
	}

	/**
	 * 全シャードのsequelizeモデルクラスを取得する。
	 * @returns 対応するsequelizeモデルクラス配列。
	 */
	public static shards<M extends ShardableModel>(this: (new () => M) & typeof ShardableModel): Array<(new () => M) & typeof ShardableModel> {
		return this.sequelizes.map((s) => s.model(this.name) as any);
	}

	/**
	 * 個別のシャードに紐づくモデルクラスか？
	 * @returns 個別のシャードに紐づく場合true。
	 */
	public static isShard(): boolean {
		// シャード管理情報が無い場合、個別のシャードに紐づくと判定
		return this.sequelizes.length === 0;
	}

	// TODO: Sequelizeのモデルからよく使うstatic関数を移植。不足している関数は必要に応じて随時追加してください。
	// ※ アプリ全体でよく使われる機能なので、多少複雑なコードになっても性能や使い易さを優先してください。

	/**
	 * 全てのレコードを取得する。
	 * @param options 検索オプション。※現状ORDER BY等シャード単位でしか機能しません
	 * @returns レコード配列。
	 */
	public static findAll(this: any, options?: FindOptions): Bluebird<any[]> {
		if (this.isShard()) {
			return Model.findAll.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = this.getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).findAll(options) as any;
		}
		// それ以外は、全シャードを検索して結果を合算して返す
		return Bluebird.all(this.shards().map((m) => m.findAll(options))).then(_.flatten) as any;
	}

	/**
	 * プライマリーキーのレコードを取得する。
	 * ※ PKがシャードキーでない場合、全シャードを検索してしまうため注意！
	 * @param identifier プライマリーキー。
	 * @param options 検索オプション。※全シャード検索の場合rejectOnEmptyは正しく機能しません
	 * @returns レコード、取得できない場合はnull。
	 */
	public static findByPk<M extends ShardableModel>(this: any, identifier?: number | string, options?: FindOptions): Bluebird<M | null> {
		if (this.isShard()) {
			return Model.findByPk.apply(this, arguments);
		}
		// IDがシャードキーの場合そのシャードのみを、それ以外は全シャードを検索する
		if (this.shard(0).primaryKeyAttribute !== this.distributionKey) {
			return Bluebird.resolve(this.findByPkFromAllShards(identifier, options)) as any;
		} else {
			// TODO: 現状stringのシャードキーには対応しないので数値のはず、対応したらキャスト外す
			return this.shard(identifier as number).findByPk(identifier, options) as any;
		}
	}

	/**
	 * 全シャードからプライマリーキーのレコードを取得する。
	 * @param identifier プライマリーキー。
	 * @param options 検索オプション。※現状rejectOnEmptyは正しく機能しません
	 * @returns レコード、取得できない場合はnull。
	 */
	private static async findByPkFromAllShards<M extends ShardableModel>(
		this: (new () => M) & typeof ShardableModel, identifier?: number | string, options?: FindOptions): Promise<M | null> {

		for (const model of this.shards()) {
			const instance = await model.findByPk(identifier, options);
			if (instance) {
				return instance as any;
			}
		}
		return null;
	}

	/**
	 * レコードを1件取得する。
	 * ※ 検索条件にシャードキーが含まれない場合、全シャードを検索してしまうため注意！
	 * @param options 検索オプション。※全シャード検索の場合rejectOnEmptyは正しく機能しません
	 * @returns レコード、取得できない場合はnull。
	 */
	public static findOne<M extends ShardableModel>(this: any, options?: FindOptions): Bluebird<M | null> {
		if (this.isShard()) {
			return Model.findOne.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = this.getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).findOne(options) as any;
		}
		// それ以外は、全シャードを検索して最初に検索したレコードを返す
		return Bluebird.resolve(this.findOneFromAllShards(options) as any);
	}

	/**
	 * 全シャードからレコードを1件取得する。
	 * @param options 検索オプション。※現状rejectOnEmptyは正しく機能しません
	 * @returns レコード、取得できない場合はnull。
	 */
	private static async findOneFromAllShards<M extends ShardableModel>(
		this: (new () => M) & typeof ShardableModel, options?: FindOptions): Promise<M | null> {

		for (const model of this.shards()) {
			const instance = await model.findOne(options);
			if (instance) {
				return instance as any;
			}
		}
		return null;
	}

	/**
	 * 全てのレコードをカウントする。
	 * @param options 検索オプション。
	 * @returns 件数。
	 */
	public static count<M extends ShardableModel>(this: (new () => M) & typeof ShardableModel, options?: CountOptions): Bluebird<any> {
		if (this.isShard()) {
			return Model.count.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = this.getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).count(options);
		}
		// それ以外は、全シャードを検索して結果を合算して返す
		// TODO: CountWithOptions時には現状未対応（戻り値が単純な数値ではなくなる）
		return Bluebird.all(this.shards().map((m) => m.count(options))).then(_.sum);
	}

	/**
	 * レコードを検索しまた件数を取得する。
	 * ※ 検索条件にシャードキーが含まれない場合、全シャードを検索してしまうため注意！
	 * @param options 検索オプション。※ORDER BY等シャード単位でしか機能しません
	 * @returns 検索結果。
	 */
	public static findAndCountAll(this: any, options?: FindAndCountOptions): Bluebird<{ rows: any[], count: number }> {
		if (this.isShard()) {
			return Model.findAndCountAll.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).findAndCountAll(options) as any;
		}
		// それ以外は、全シャードを検索して結果を合算して返す
		return Bluebird.resolve(this.findAndCountAllFromAllShards(options)) as any;
	}

	/**
	 * レコードを検索しまた件数を取得する。
	 * ※ 検索条件にシャードキーが含まれない場合、全シャードを検索してしまうため注意！
	 * @param options 検索オプション。※ORDER BY等シャード単位でしか機能しません
	 * @returns 検索結果。
	 */
	private static async findAndCountAllFromAllShards<M extends ShardableModel>(
		this: (new () => M) & typeof ShardableModel, options?: FindAndCountOptions): Promise<{ rows: M[], count: number }> {

		// FIXME: findAndCountはORDER BYやLIMITを使いたい関数なので、可能であれば何か対処する（特にLIMITは）
		const result = { rows: [], count: 0 };
		for (const model of this.shards()) {
			const r = await model.findAndCountAll(options);
			result.count = result.count + r.count;
			result.rows.push(...r.rows);
		}
		return result;
	}

	/**
	 * モデルのインスタンスを生成する。
	 * @param record インスタンスに指定するパラメータ。
	 * @param options 作成オプション。
	 * @returns 生成したインスタンス。
	 * @throws Error シャードキーが存在しない場合。
	 */
	public static build(this: any, record?: object, options?: BuildOptions): any {
		if (this.isShard()) {
			return Model.build.apply(this, arguments);
		}
		return this.shard(this.getDistributionValueFromValues(record)).build(record, options) as any;
	}

	/**
	 * モデルのインスタンスを生成してINSERTする。
	 * @param values インスタンスに指定するパラメータ。
	 * @param options 作成オプション。※トランザクション等シャード単位でしか機能しません
	 * @returns 生成したインスタンス。
	 * @throws Error シャードキーが存在しない場合。
	 */
	public static create<M extends ShardableModel>(this: any, values?: object, options?: CreateOptions): Bluebird<M> {
		if (this.isShard()) {
			return Model.create.apply(this, arguments);
		}
		return this.shard(this.getDistributionValueFromValues(values)).create(values, options) as any;
	}

	/**
	 * モデルを検索して、存在する場合はそのレコードを、しない場合は新規生成したインスタンスを返す。
	 * @param options 検索／生成オプション。
	 * @returns 検索／生成したインスタンス。
	 * @throws Error シャードキーが存在しない場合。
	 */
	public static findOrBuild(this: any, options: FindOrCreateOptions): Bluebird<[any, boolean]> {
		if (this.isShard()) {
			return Model.findOrBuild.apply(this, arguments);
		}
		const distributionValue = this.getDistributionValueFromFindOptions(options);
		if (distributionValue === null) {
			throw new Error(`The distribution value '${this.distributionKey}' is not found.`);
		}
		return this.shard(distributionValue).findOrBuild(options) as any;
	}

	/**
	 * モデルを検索して、存在する場合はそのレコードを、しない場合はINSERTしたインスタンスを返す。
	 * @param options 検索／生成オプション。
	 * @returns 検索／生成したインスタンス。
	 * @throws Error シャードキーが存在しない場合。
	 */
	public static findOrCreate(this: any, options: FindOrCreateOptions): Bluebird<[any, boolean]> {
		if (this.isShard()) {
			return Model.findOrCreate.apply(this, arguments);
		}
		const distributionValue = this.getDistributionValueFromFindOptions(options);
		if (distributionValue === null) {
			throw new Error(`The distribution value '${this.distributionKey}' is not found.`);
		}
		return this.shard(distributionValue).findOrCreate(options) as any;
	}

	/**
	 * レコードをINSERTまたはUPDATEする。
	 * @param values レコードの値。
	 * @param options 更新オプション。※トランザクション等シャード単位でしか機能しません
	 * @returns INSERTの場合true、それ以外はfalse。
	 */
	public static upsert<M extends ShardableModel>(this: (new () => M) & typeof ShardableModel, values: object, options?: UpsertOptions): Bluebird<any> {
		if (this.isShard()) {
			return Model.upsert.apply(this, arguments);
		}
		return this.shard(this.getDistributionValueFromValues(values)).upsert(values, options);
	}

	/**
	 * 全レコードをTRUNCATEする。
	 * @param options TRUNCATEオプション。
	 * @returns 処理状態。
	 */
	public static truncate<M extends ShardableModel>(this: (new () => M) & typeof ShardableModel, options?: TruncateOptions): Bluebird<void> {
		if (this.isShard()) {
			return Model.truncate.apply(this, arguments);
		}
		return Bluebird.all(this.shards().map((m) => m.truncate(options))) as any;
	}

	/**
	 * 指定されたフィールドを加算する。
	 * @param fields フィールド名。
	 * @param options 加算オプション。
	 * @returns 処理結果。
	 */
	public static increment<M extends ShardableModel, K extends keyof M>(
		this: (new () => M) & typeof ShardableModel,
		fields: K | K[] | { [key in K]?: number },
		options: IncrementDecrementOptionsWithBy,
	): Bluebird<M> {
		if (this.isShard()) {
			return Model.increment.apply(this, arguments);
		}
		const distributionValue = this.getDistributionValueFromFindOptions(options);
		if (distributionValue === null) {
			throw new Error(`The distribution value '${this.distributionKey}' is not found.`);
		}
		return this.shard(distributionValue).increment(fields as any, options) as any;
	}

	/**
	 * 全レコードをイテレーターで取得する。
	 * @param options 検索オプション。※ORDER BY等シャード単位でしか機能しません
	 * @returns レコードを返すイテレータ。
	 */
	public static async* iterateAll<M extends ShardableModel>(
		this: (new () => M) & typeof ShardableModel, options?: FindOptions): AsyncIterableIterator<M> {

		// ※ findAllだと全シャードの結果を一度に返してメモリの無駄なの独自に定義。
		//    本当は個別の検索もカーソル的なものにしたいが、良い方法がないのでfindAllで我慢。
		if (this.isShard()) {
			// 個別のシャード用の処理
			const instances = await this.findAll(options);
			for (const instance of instances) {
				yield instance as any;
			}
		} else {
			// シャードキーが指定されている場合そのシャードのみ、それ以外は全シャードを検索して返す
			let models = this.shards();
			const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
			if (distributionValue !== null) {
				models = [this.shard(distributionValue)];
			}
			for (const model of models) {
				for await (const instance of model.iterateAll(options)) {
					yield instance as any;
				}
			}
		}
	}

	/**
	 * オブジェクトからシャードキーの値を取得する。
	 * @param values 値の入ったオブジェクト。
	 * @returns シャードキーの値。
	 * @throws Error シャードキーが存在しない場合。
	 */
	protected static getDistributionValueFromValues(values: any): number {
		if (values instanceof Object && values[this.distributionKey] !== undefined && values[this.distributionKey] !== null) {
			// TODO: 現状stringのシャードキーには対応しないので数値のはず
			return Number(values[this.distributionKey]);
		}
		throw new Error(`The distribution value '${this.distributionKey}' is not found.`);
	}

	/**
	 * 検索条件からシャードキーの値を取得する。
	 * @param options 値の入ったオブジェクト。
	 * @returns シャードキーの値。キーが存在しない場合null。
	 */
	protected static getDistributionValueFromFindOptions(options: FindOptions): number | null {
		// ※ 現状、単純な=条件のみに対応。それ以外の使い方の場合は取れない
		if (options && options.where && typeof options.where[this.distributionKey] === 'number') {
			return options.where[this.distributionKey];
		}
		return null;
	}
}
