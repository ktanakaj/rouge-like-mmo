/**
 * ユニットテストの初期化処理モジュール。
 * @module ./mocha
 */
import * as assert from 'power-assert';
// import * as util from 'util';
// import * as child_process from 'child_process';
import * as fs from 'fs';
import * as config from 'config';
import * as log4js from 'log4js';
import { Sequelize } from 'sequelize-typescript';
import { databaseProviders, IDatabaseProvider } from './shared/database.providers';
import MasterVersion from './shared/master-version.model';
import { fileUtils } from './core/utils';
import { getClient } from './core/redis';
import { ShardableSequelize } from './core/db';
import invokeContext from './shared/invoke-context';

// const execAsync = util.promisify(child_process.exec);

// ここにフックを書くと全テストの前に自動実行される
before('global initialization for all tests', async function () {
	// ※ 初期化に時間がかかる場合は伸ばす
	this.timeout(15000);

	// 全テストの実行前に一度だけ必要な処理を実施
	log4js.configure(config['log4js']);

	// ※ 以下、時間がかかるものは可能な限り非同期で並列に流す
	const promises = [];

	// Sequelizeの初期化
	for (const databaseProvider of databaseProviders) {
		promises.push(dbinit(databaseProvider));
	}

	// Redisの初期化
	promises.push(getClient(config['redis']['redis']).flushdbAsync());
	promises.push(getClient(config['redis']['cache']).flushdbAsync());

	await Promise.all(promises);

	// 最新マスタの探索
	const version = await MasterVersion.findLatest();
	assert(version, 'Master data is not imported. Please try to "npm run fulltest".');
	invokeContext.setMasterVersion(version.id);
});

/**
 * Sequelizeをユニットテスト用に初期化する。
 * @param databaseProvider 処理対象のDBプロバイダー。
 * @returns 処理状態。
 */
async function dbinit(databaseProvider: IDatabaseProvider): Promise<void> {
	const dbname = databaseProvider.provide.replace('SequelizeToken', '').toLowerCase();

	// テーブル等を一度全て削除して、マイグレーションスクリプトで再生成する
	const sequelize = await databaseProvider.useFactory();
	// 高速化のため、マスタDBは既にあるものを用いる
	if (dbname === 'master') {
		return;
	}

	// ※ syncでも再生成できるが、実際の運用で使うのはスクリプトなので、テストでもそちらを使うようにする
	// ※ 本当はexecAsyncでマイグレーションバッチを呼びたいが、時間がかかるため、自前で処理
	// await execAsync(`NODE_ENV=${process.env.NODE_ENV} npm run db-migrate -- --db=${dbname} --undo --all`, { encoding: 'utf8' });
	// await execAsync(`NODE_ENV=${process.env.NODE_ENV} npm run db-migrate -- --db=${dbname}`, { encoding: 'utf8' });
	await sequelize.drop();
	if (sequelize instanceof ShardableSequelize) {
		await shardableDbMigrate(dbname, sequelize);
	} else {
		await dbMigrate(dbname, sequelize);
	}
}

/**
 * シャーディングDBをユニットテスト用にマイグレーションする。
 * @param dbname DB名。
 * @param sequelize Sequelizeコネクション。
 * @returns 処理状態。
 */
function shardableDbMigrate(dbname: string, sequelize: ShardableSequelize): Promise<void> {
	// ※ 時間がかかるので非同期で並列に流す
	const promises = [];
	for (const s of sequelize.sequelizes) {
		promises.push(dbMigrate(dbname, s));
	}
	return Promise.all(promises) as Promise<any>;
}

/**
 * DBをユニットテスト用にマイグレーションする。
 * @param dbname DB名。
 * @param sequelize Sequelizeコネクション。
 * @returns 処理状態。
 */
async function dbMigrate(dbname: string, sequelize: Sequelize): Promise<void> {
	const scriptsDir = __dirname + '/batch/migrations/' + dbname + '/';
	if (!fs.existsSync(scriptsDir)) {
		return;
	}
	const scripts = fileUtils.requireDirectoriesSync(scriptsDir);
	for (const key in scripts) {
		const func = scripts[key]['up'];
		if (func) {
			await func(sequelize.getQueryInterface(), sequelize.Sequelize);
		}
	}
}