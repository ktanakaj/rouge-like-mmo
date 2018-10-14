/**
 * DB接続定義モジュール。
 * @module ./shared/databases.providers
 */
import 'reflect-metadata';
import * as config from 'config';
import * as log4js from 'log4js';
import * as _ from 'lodash';
import { Sequelize, Model } from 'sequelize-typescript';
import fileUtils from '../core/utils/file-utils';
import { DB_KEY } from '../core/models/decorators';

/** モデル一覧 */
export const MODELS: { master: typeof Model[] } = { master: [] };

// モデルは、拡張子が .model.ts のファイルを検索して付加されているデコレーターの情報を見て判別する
// ※ .model.ts にはRedisなどの非DBモデルもあるので、DB情報があるもののみ処理
fileUtils.directoryWalkRecursiveSync(__dirname + '/../', (p) => {
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

/** 各DB接続用のプロバイダー */
export const databaseProviders = [];

const debugLog = (log, time) => {
	if (typeof time === 'number') {
		log = `${log} Elapsed time: ${time}ms`;
	}
	log4js.getLogger('debug').debug(log);
};

for (const dbname of Object.keys(MODELS)) {
	if (!config['databases'][dbname]) {
		throw new Error(`db='${dbname}' is not found`);
	}

	const options = Object.assign({
		logging: debugLog,
		operatorsAliases: false,
	}, config['databases'][dbname]);

	databaseProviders.push({
		provide: _.upperFirst(_.camelCase(dbname)) + 'SequelizeToken',
		useFactory: async () => {
			const sequelize = new Sequelize(options);
			sequelize.addModels(MODELS[dbname]);
			if (dbname !== 'master') {
				// TODO: syncは止める
				await sequelize.sync();
			}
			return sequelize;
		},
	});
}

/** 各モデルをリポジトリーとして扱うためのプロバイダー */
export const modelProviders = _.flatMap(Object.values(MODELS), (models: typeof Model[]) => {
	return models.map((model) => {
		return {
			provide: `${model.name}Repository`,
			useValue: model,
		};
	});
});