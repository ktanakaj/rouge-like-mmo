/**
 * ユニットテストの初期化処理モジュール。
 * @module ./test
 */
require('ts-node/register');
// const util = require('util');
// const child_process = require('child_process');
const fs = require('fs');
const config = require('config');
const fileUtils = require('./core/utils').fileUtils;
const getClient = require('./core/redis').getClient;
const ShardableSequelize = require('./core/db').ShardableSequelize;
const databaseProviders = require('./shared/database.providers').databaseProviders;
const importMaster = require('./shared/master-importer').importMaster;

// const execAsync = util.promisify(child_process.exec);

// 環境セットアップ的な初期化スクリプト。
// DBの初期化などを行う。ここで、プログラム的な初期化をしてもJESTの仕組み上反映されない模様。
// （プログラム的な初期化は現状 test-helper.ts 内の beforeAll で実施。）

module.exports = async() => {
	// ※ 以下、時間がかかるものは可能な限り非同期で並列に流す
	let promises = [];

	// Sequelizeの初期化
	for (const databaseProvider of databaseProviders) {
		promises.push(dbinit(databaseProvider));
	}

	// Redisの初期化
	promises.push(getClient(config['redis']['redis']).flushdbAsync());
	promises.push(getClient(config['redis']['cache']).flushdbAsync());

	await Promise.all(promises);

	// マスタのインポート
	// ※ 本当はexecAsyncでインポートバッチを呼びたいが、バッチ起動に時間がかかるため、自前で処理
	promises = [];
	fileUtils.directoryWalkSync(__dirname + '/../test/masters/', (f) => {
		if (/\.csv$/.test(f)) {
			promises.push(importMaster(f));
		}
	});

	await Promise.all(promises);
};

/**
 * Sequelizeをユニットテスト用に初期化する。
 * @param databaseProvider 処理対象のDBプロバイダー。
 * @returns 処理状態。
 */
async function dbinit(databaseProvider) {
	const dbname = databaseProvider.provide.replace('SequelizeToken', '').toLowerCase();

	// テーブル等を一度全て削除して、マイグレーションスクリプトで再生成する
	const sequelize = await databaseProvider.useFactory();

	// ※ syncでも再生成できるが、実際の運用で使うのはスクリプトなので、テストでもそちらを使うようにする
	// ※ 本当はexecAsyncでマイグレーションバッチを呼びたいが、バッチ起動に時間がかかるため、自前で処理
	// await execAsync(
	//   `NODE_ENV=${process.env.NODE_ENV} npm run db-migrate -- --db=${dbname} --undo --all`, { encoding: 'utf8' });
	// await execAsync(
	//   `NODE_ENV=${process.env.NODE_ENV} npm run db-migrate -- --db=${dbname}`, { encoding: 'utf8' });
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
function shardableDbMigrate(dbname, sequelize) {
	// ※ 時間がかかるので非同期で並列に流す
	const promises = [];
	for (const s of sequelize.sequelizes) {
		promises.push(dbMigrate(dbname, s));
	}
	return Promise.all(promises);
}

/**
 * DBをユニットテスト用にマイグレーションする。
 * @param dbname DB名。
 * @param sequelize Sequelizeコネクション。
 * @returns 処理状態。
 */
async function dbMigrate(dbname, sequelize) {
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
