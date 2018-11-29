/**
 * sequelize-typescriptのモデルをシャーディング環境用に拡張したモデルモジュール。
 * @module ./core/models/shardable-model
 */
import { Sequelize, Model, IFindOptions, ICountOptions, IBuildOptions, ICreateOptions } from 'sequelize-typescript';
import { UpsertOptions, TruncateOptions, InstanceIncrementDecrementOptions } from 'sequelize';
import * as _ from 'lodash';
import * as Bluebird from 'bluebird';
import { IFindOrInitializeOptions } from 'sequelize-typescript/lib/interfaces/IFindOrInitializeOptions';
import { NonAbstract } from 'sequelize-typescript/lib/utils/types';

/** モデル型定義。typeof T がコンパイルエラーになるのでその代替。 */
type NonAbstractTypeOfShardableModel<T> = (new () => T) & NonAbstract<typeof ShardableModel>;

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
export default abstract class ShardableModel<T extends Model<T>> extends Model<T> {
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

	/**
	 * シャーディングキーの値から対応するsequelizeモデルクラスを取得する。
	 * @param distributionValue シャーディングキーの値。
	 * @returns 対応するsequelizeモデルクラス。
	 */
	public static shard<T>(this: NonAbstractTypeOfShardableModel<T>, distributionValue: number): NonAbstractTypeOfShardableModel<T> {
		return this.shardDb(distributionValue).model(this.name) as any;
	}

	/**
	 * 全シャードのsequelizeモデルクラスを取得する。
	 * @returns 対応するsequelizeモデルクラス配列。
	 */
	public static shards<T>(this: NonAbstractTypeOfShardableModel<T>): NonAbstractTypeOfShardableModel<T>[] {
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
	public static findAll<T>(this: NonAbstractTypeOfShardableModel<T>, options?: IFindOptions<T>): Bluebird<T[]> {
		if (this.isShard()) {
			return Model.findAll.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).findAll(options);
		}
		// それ以外は、全シャードを検索して結果を合算して返す
		return Bluebird.all(this.shards().map((m) => m.findAll(options))).then(_.flatten);
	}

	/**
	 * プライマリーキーのレコードを取得する。
	 * ※ PKがシャードキーでない場合、全シャードを検索してしまうため注意！
	 * @param identifier プライマリーキー。
	 * @param options 検索オプション。※全シャード検索の場合rejectOnEmptyは正しく機能しません
	 * @returns レコード、取得できない場合はnull。
	 */
	public static findById<T>(this: NonAbstractTypeOfShardableModel<T>, identifier?: number | string, options?: IFindOptions<T>): Bluebird<T | null> {
		if (this.isShard()) {
			return Model.findById.apply(this, arguments);
		}
		// IDがシャードキーの場合そのシャードのみを、それ以外は全シャードを検索する
		if (this.shard(0).primaryKeyAttribute !== this.distributionKey) {
			return Bluebird.resolve((this as any).findByIdFromAllShards(identifier, options));
		} else {
			// TODO: 現状stringのシャードキーには対応しないので数値のはず、対応したらキャスト外す
			return this.shard(identifier as number).findById(identifier, options);
		}
	}

	/**
	 * 全シャードからプライマリーキーのレコードを取得する。
	 * @param identifier プライマリーキー。
	 * @param options 検索オプション。※現状rejectOnEmptyは正しく機能しません
	 * @returns レコード、取得できない場合はnull。
	 */
	private static async findByIdFromAllShards<T>(
		this: NonAbstractTypeOfShardableModel<T>, identifier?: number | string, options?: IFindOptions<T>): Promise<T | null> {

		for (const model of this.shards()) {
			const instance = await model.findById(identifier, options);
			if (instance) {
				return instance;
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
	public static findOne<T>(this: NonAbstractTypeOfShardableModel<T>, options?: IFindOptions<T>): Bluebird<T | null> {
		if (this.isShard()) {
			return Model.findOne.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).findOne(options);
		}
		// それ以外は、全シャードを検索して最初に検索したレコードを返す
		return Bluebird.resolve((this as any).findOneFromAllShards(options));
	}

	/**
	 * 全シャードからレコードを1件取得する。
	 * @param options 検索オプション。※現状rejectOnEmptyは正しく機能しません
	 * @returns レコード、取得できない場合はnull。
	 */
	private static async findOneFromAllShards<T>(this: NonAbstractTypeOfShardableModel<T>, options?: IFindOptions<T>): Promise<T | null> {
		for (const model of this.shards()) {
			const instance = await model.findOne(options);
			if (instance) {
				return instance;
			}
		}
		return null;
	}

	/**
	 * 全てのレコードをカウントする。
	 * @param options 検索オプション。
	 * @returns 件数。
	 */
	public static count<T>(this: NonAbstractTypeOfShardableModel<T>, options?: ICountOptions<T>): Bluebird<number> {
		if (this.isShard()) {
			return Model.count.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).count(options);
		}
		// それ以外は、全シャードを検索して結果を合算して返す
		return Bluebird.all(this.shards().map((m) => m.count(options))).then(_.sum);
	}

	/**
	 * レコードを検索しまた件数を取得する。
	 * ※ 検索条件にシャードキーが含まれない場合、全シャードを検索してしまうため注意！
	 * @param options 検索オプション。※ORDER BY等シャード単位でしか機能しません
	 * @returns 検索結果。
	 */
	public static findAndCount<T>(this: NonAbstractTypeOfShardableModel<T>, options?: IFindOptions<T>): Bluebird<{ rows: T[], count: number }> {
		if (this.isShard()) {
			return Model.findAndCount.apply(this, arguments);
		}
		// シャードキーが指定されている場合、そのシャードのみ検索
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue !== null) {
			return this.shard(distributionValue).findAndCount(options);
		}
		// それ以外は、全シャードを検索して結果を合算して返す
		return Bluebird.resolve((this as any).findAndCountFromAllShards(options));
	}

	/**
	 * レコードを検索しまた件数を取得する。
	 * ※ 検索条件にシャードキーが含まれない場合、全シャードを検索してしまうため注意！
	 * @param options 検索オプション。※ORDER BY等シャード単位でしか機能しません
	 * @returns 検索結果。
	 */
	private static async findAndCountFromAllShards<T>(
		this: NonAbstractTypeOfShardableModel<T>, options?: IFindOptions<T>): Promise<{ rows: T[], count: number }> {

		// FIXME: findAndCountはORDER BYやLIMITを使いたい関数なので、可能であれば何か対処する（特にLIMITは）
		const result = { rows: [], count: 0 };
		for (const model of this.shards()) {
			const r = await model.findAndCount(options);
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
	public static build<T, A>(this: NonAbstractTypeOfShardableModel<T>, record?: A, options?: IBuildOptions): T {
		if (this.isShard()) {
			return Model.build.apply(this, arguments);
		}
		return this.shard((this as any).getDistributionValueFromValues(record)).build(record, options);
	}

	/**
	 * モデルのインスタンスを生成してINSERTする。
	 * @param values インスタンスに指定するパラメータ。
	 * @param options 作成オプション。※トランザクション等シャード単位でしか機能しません
	 * @returns 生成したインスタンス。
	 * @throws Error シャードキーが存在しない場合。
	 */
	public static create<T, A>(this: NonAbstractTypeOfShardableModel<T>, values?: A, options?: ICreateOptions): Bluebird<T> {
		if (this.isShard()) {
			return Model.create.apply(this, arguments);
		}
		return this.shard((this as any).getDistributionValueFromValues(values)).create(values, options);
	}

	/**
	 * モデルを検索して、存在する場合はそのレコードを、しない場合は新規生成したインスタンスを返す。
	 * @param options 検索／生成オプション。
	 * @returns 検索／生成したインスタンス。
	 * @throws Error シャードキーが存在しない場合。
	 */
	public static findOrBuild<T, A>(this: NonAbstractTypeOfShardableModel<T>, options: IFindOrInitializeOptions<A>): Bluebird<[T, boolean]> {
		if (this.isShard()) {
			return Model.findOrBuild.apply(this, arguments);
		}
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue === null) {
			throw new Error(`The distribution value '${this.distributionKey}' is not found.`);
		}
		return this.shard(distributionValue).findOrBuild(options);
	}

	/**
	 * モデルを検索して、存在する場合はそのレコードを、しない場合はINSERTしたインスタンスを返す。
	 * @param options 検索／生成オプション。
	 * @returns 検索／生成したインスタンス。
	 * @throws Error シャードキーが存在しない場合。
	 */
	public static findOrCreate<T, A>(this: NonAbstractTypeOfShardableModel<T>, options: IFindOrInitializeOptions<A>): Bluebird<[T, boolean]> {
		if (this.isShard()) {
			return Model.findOrCreate.apply(this, arguments);
		}
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue === null) {
			throw new Error(`The distribution value '${this.distributionKey}' is not found.`);
		}
		return this.shard(distributionValue).findOrCreate(options);
	}

	/**
	 * レコードをINSERTまたはUPDATEする。
	 * @param values レコードの値。
	 * @param options 更新オプション。※トランザクション等シャード単位でしか機能しません
	 * @returns INSERTの場合true、それ以外はfalse。
	 */
	public static upsert<T, A>(this: NonAbstractTypeOfShardableModel<T>, values: A, options?: UpsertOptions): Bluebird<any> {
		if (this.isShard()) {
			return Model.upsert.apply(this, arguments);
		}
		return this.shard((this as any).getDistributionValueFromValues(values)).upsert(values, options);
	}

	/**
	 * 全レコードをTRUNCATEする。
	 * @param options TRUNCATEオプション。
	 * @returns 処理状態。
	 */
	public static truncate<T>(this: NonAbstractTypeOfShardableModel<T>, options?: TruncateOptions): Bluebird<void> {
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
	public static increment<T>(
		this: NonAbstractTypeOfShardableModel<T>,
		fields: string | string[] | object,
		options?: InstanceIncrementDecrementOptions & { silent?: boolean },
	): Bluebird<[Array<T>, number]> | Bluebird<[number, void]> {
		if (this.isShard()) {
			return Model.increment.apply(this, arguments);
		}
		const distributionValue = (this as any).getDistributionValueFromFindOptions(options);
		if (distributionValue === null) {
			throw new Error(`The distribution value '${this.distributionKey}' is not found.`);
		}
		return this.shard(distributionValue).increment(fields, options);
	}

	/**
	 * 全レコードをイテレーターで取得する。
	 * @param options 検索オプション。※ORDER BY等シャード単位でしか機能しません
	 * @returns レコードを返すイテレータ。
	 */
	public static async* iterateAll<T>(this: NonAbstractTypeOfShardableModel<T>, options?: IFindOptions<T>): AsyncIterableIterator<T> {
		// ※ findAllだと全シャードの結果を一度に返してメモリの無駄なの独自に定義。
		//    本当は個別の検索もカーソル的なものにしたいが、良い方法がないのでfindAllで我慢。
		if (this.isShard()) {
			// 個別のシャード用の処理
			const instances = await this.findAll(options);
			for (const instance of instances) {
				yield instance;
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
					yield instance;
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
	protected static getDistributionValueFromFindOptions<T>(this: NonAbstractTypeOfShardableModel<T>, options: IFindOptions<T>): number | null {
		// ※ 現状、単純な=条件のみに対応。それ以外の使い方の場合は取れない
		if (options && options.where && typeof options.where[this.distributionKey] === 'number') {
			return options.where[this.distributionKey];
		}
		return null;
	}
}
