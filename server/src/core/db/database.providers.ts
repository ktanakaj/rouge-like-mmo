/**
 * DB接続定義モジュール。
 * @module ./core/db/databases.providers
 */
import 'reflect-metadata';
import * as config from 'config';
import * as log4js from 'log4js';
import * as _ from 'lodash';
import { Sequelize, Model } from 'sequelize-typescript';
import fileUtils from '../utils/file-utils';
import { ShardableSequelize, DB_KEY } from './shardable';

/** モデル一覧 */
export const MODELS: { master: Array<typeof Model> } = { master: [] };

// モデルは、拡張子が .model.ts のファイルを検索して付加されているデコレーターの情報を見て判別する
// ※ .model.ts にはRedisなどの非DBモデルもあるので、DB情報があるもののみ処理
fileUtils.directoryWalkRecursiveSync(__dirname + '/../../', (p) => {
	if (/\.model\.[jt]s$/.test(p)) {
		const m = require(p);
		const model = m['default'] || m;
		if (typeof model === 'function') {
			const db = Reflect.getMetadata(DB_KEY, model);
			if (db) {
				if (!MODELS[db]) {
					MODELS[db] = [];
				}
				MODELS[db].push(model);
			}
		}
	}
});

export interface IDatabaseProvider { provide: string; useFactory: () => Promise<Sequelize | ShardableSequelize>; }

/** 各DB接続用のプロバイダー */
export const databaseProviders: IDatabaseProvider[] = [];

const debugLog = (log, time) => {
	if (typeof time === 'number') {
		log = `${log} Elapsed time: ${time}ms`;
	}
	log4js.getLogger('db').debug(log);
};

for (const dbname of Object.keys(MODELS)) {
	if (!config['databases'][dbname]) {
		throw new Error(`db='${dbname}' is not found`);
	}

	// コンフィグにシャーディング用の設定がある場合、シャーディング用のクラスで初期化する
	const options = Object.assign({
		logging: debugLog,
	}, config['databases'][dbname]);

	let dbclazz: any = Sequelize;
	if (options['databases']) {
		dbclazz = ShardableSequelize;
	}

	databaseProviders.push({
		provide: _.upperFirst(_.camelCase(dbname)) + 'SequelizeToken',
		useFactory: async () => {
			const sequelize = new dbclazz(options);
			sequelize.addModels(MODELS[dbname]);
			return sequelize;
		},
	});
}

/** 各モデルをリポジトリーとして扱うためのプロバイダー */
export const modelProviders = _.flatMap(Object.values(MODELS), (models: Array<typeof Model>) => {
	return models.map((model) => {
		return {
			provide: `${model.name}Repository`,
			useValue: model,
		};
	});
});
