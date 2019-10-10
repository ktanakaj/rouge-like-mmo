/**
 * sequelize-typescriptでシャーディングされたDBを扱うためのモジュール。
 * @module ./core/models/shardable-sequelize
 */
import 'reflect-metadata';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { SyncOptions, DropOptions } from 'sequelize';
import { fileUtils } from '../../core/utils';
import ShardableModel from './shardable-model';
import { DISTRIBUTION_KEY } from './distribution-key.decorator';

interface ShardableSequelizeConfig {
	// 本来のSequelizeのoptionsのうち、DB固有のものは配列で、それ以外は直接指定するイメージ
	// ※ 型定義上は databases の中にも modelPaths を指定できますが、使用しない想定です。
	// ※ modelPaths以外については、マージされるのでここに無いパラメータでも使用可能です。
	databases: SequelizeOptions[];
	modelPaths?: string[];
	logging?: boolean | Function;
	benchmark?: boolean;
}

/**
 * シャーディングされたDBを扱うためのSequelize拡張用クラス。
 */
export class ShardableSequelize {
	/** 各シャードのSequelizeインスタンス。 */
	public sequelizes: Sequelize[] = [];

	/**
	 * シャーディングされたDB用のSequelizeインスタンスを生成する。
	 * @param config DB設定。
	 */
	constructor(config: ShardableSequelizeConfig) {
		if (config.databases.length === 0) {
			throw new Error(`databases are required.`);
		}
		for (let i = 0; i < config.databases.length; i++) {
			const dbconfig = config.databases[i];
			if (Array.isArray(dbconfig.modelPaths)) {
				throw new Error(`databases[${i}].modelPaths can't be used. You can use modelpaths in root.`);
			}

			// グローバルな設定を各シャード用の設定にマージする
			const c = Object.assign({}, dbconfig);
			for (const key in config) {
				if (c[key] === undefined) {
					if (key === 'logging' && typeof config[key] === 'function') {
						// ログ関数の場合、DB番号を追加する
						const func = config[key] as Function;
						c[key] = function (log) {
							arguments[0] = `DB#${i} ${log}`;
							func(...arguments);
						};
					} else if (key !== 'databases' && key !== 'modelPaths') {
						c[key] = config[key];
					}
				}
			}
			this.sequelizes.push(new Sequelize(c));
		}
		if (Array.isArray(config.modelPaths)) {
			this.addModels(config.modelPaths);
		}
	}

	/**
	 * モデルクラスをsequelizeに追加する。
	 * @param modelsOrModelPaths モデルクラス配列orモデルクラスパス配列。
	 */
	public addModels(modelsOrModelPaths: (typeof ShardableModel)[] | string[]): void {
		// モデルクラスをディレクトリから読み込み
		const models: (typeof ShardableModel)[] = [];
		if (modelsOrModelPaths && typeof modelsOrModelPaths[0] === 'string') {
			for (const modelPath of modelsOrModelPaths as string[]) {
				models.push(...Object.values(fileUtils.requireDirectoriesRecursiveSync(modelPath)).map((m) => m['default'] || m));
			}
		} else {
			models.push(...(modelsOrModelPaths as (typeof ShardableModel)[]));
		}
		// モデルクラスのデコレーターによる情報を展開
		for (const m of models) {
			const distributionKey = Reflect.getMetadata(DISTRIBUTION_KEY, m);
			if (distributionKey) {
				m.distributionKey = distributionKey;
			}
		}
		// モデルクラスを各シェードのSequelizeと紐づけ
		for (const s of this.sequelizes) {
			// ※ 元のクラスをそのまま渡してしまうと、static変数と特定のsequelizeインスタンスが紐づいてしまうので、
			//    動的にサブクラスを生成してそれを渡す。
			const subclasses: (typeof ShardableModel)[] = models.map((m) => this.createDynamicSubClass(m as any)) as any;
			// そのままだとstaticプロパティが元クラスに連動してしまうので、初期化して上書きしておく
			for (const m of subclasses) {
				m.sequelizes = [];
			}
			s.addModels(subclasses as any);
		}
		// 全シェードのSequelizeインスタンスをモデルクラスに紐づける
		for (const m of models) {
			m.sequelizes = this.sequelizes;
		}
	}

	/**
	 * 全sequelizeでsyncを実行する。
	 * @param options syncオプション。
	 * @returns 処理状態。
	 */
	public sync(options?: SyncOptions): Promise<any> {
		return Promise.all(this.sequelizes.map((s) => s.sync(options)));
	}

	/**
	 * 全sequelizeでdropを実行する。
	 * @param options dropオプション。
	 * @returns 処理状態。
	 */
	public drop(options?: DropOptions): Promise<any> {
		return Promise.all(this.sequelizes.map((s) => s.drop(options)));
	}

	/**
	 * 指定されたクラスから動的にサブクラスを作成する。
	 * @param clazz クラス。
	 * @returns 生成されたサブクラス。
	 */
	private createDynamicSubClass<T>(clazz: (new () => T)): new () => T {
		// ※ 本当はクラス定義自体をcloneしたかったが、そういうことはできないようだったのでサブクラス生成
		const subclazz = class extends (clazz as any) { };
		Object.defineProperty(subclazz, 'name', Object.getOwnPropertyDescriptor(clazz, 'name'));
		return subclazz as any;
	}
}
