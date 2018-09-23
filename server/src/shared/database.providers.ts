/**
 * DB接続定義モジュール。
 * @module ./shared/databases.providers
 */
import * as config from 'config';
import * as log4js from 'log4js';
import * as _ from 'lodash';
import { Sequelize, Model } from 'sequelize-typescript';

import MasterVersion from './master-version.model';
import ErrorCode from './error-code.model';
import Gacha from '../game/gachas/gacha.model';
import GachaItem from '../game/gachas/gacha-item.model';
import Administrator from '../admin/shared/administrator.model';
import User from '../game/shared/user.model';

// TODO: モデル追加するたびにリストに追加するの何とかしたい
//       （ファイル名で区別して自動的にリストアップするとか）

/** マスタモデルクラス一覧 */
export const MASTER_MODELS: typeof Model[] = [
	ErrorCode,
	MasterVersion,
	Gacha,
	GachaItem,
];
/** GMツールモデルクラス一覧 */
export const ADMIN_MODELS: typeof Model[] = [
	Administrator,
];
/** グローバルDBモデルクラス一覧 */
export const GLOBAL_MODELS: typeof Model[] = [
	User,
];

const debugLog = (log, time) => {
	if (typeof time === 'number') {
		log = `${log} Elapsed time: ${time}ms`;
	}
	log4js.getLogger('debug').debug(log);
};

/** 各DB接続用のプロバイダー */
export const databaseProviders = [
	{
		provide: 'MasterSequelizeToken',
		useFactory: async () => {
			const sequelize = new Sequelize(Object.assign({
				logging: debugLog,
				operatorsAliases: false,
			}, config['databases']['master']));
			sequelize.addModels(MASTER_MODELS);
			return sequelize;
		},
	},
	{
		provide: 'AdminSequelizeToken',
		useFactory: async () => {
			const sequelize = new Sequelize(Object.assign({
				logging: debugLog,
				operatorsAliases: false,
			}, config['databases']['admin']));
			sequelize.addModels(ADMIN_MODELS);
			await sequelize.sync();
			return sequelize;
		},
	},
	{
		provide: 'GlobalSequelizeToken',
		useFactory: async () => {
			const sequelize = new Sequelize(Object.assign({
				logging: debugLog,
				operatorsAliases: false,
			}, config['databases']['global']));
			sequelize.addModels(GLOBAL_MODELS);
			await sequelize.sync();
			return sequelize;
		},
	},
];

/** 各モデルをリポジトリーとして扱うためのプロバイダー */
export const modelProviders = _.flatMap([MASTER_MODELS, ADMIN_MODELS, GLOBAL_MODELS], (models) => {
	return models.map((model) => {
		return {
			provide: `${model.name}Repository`,
			useValue: model,
		};
	});
});