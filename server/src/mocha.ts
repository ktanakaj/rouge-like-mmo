/**
 * ユニットテストの初期化処理モジュール。
 * @module ./mocha
 */
import * as assert from 'power-assert';
import * as config from 'config';
import * as log4js from 'log4js';
import { databaseProviders } from './shared/database.providers';
import MasterVersion from './shared/master-version.model';
import Administrator from './admin/shared/administrator.model';
import { getClient } from './core/models/redis-helper';
import invokeContext from './shared/invoke-context';

let versionId = null;

// ここにフックを書くと全テストの前に自動実行される
before('global initialization for all tests', async function () {
	// ※ 初期化に時間がかかる場合は伸ばす
	this.timeout(10000);

	// 全テストの実行前に一度だけ必要な処理を実施
	log4js.configure(config['log4js']);

	// Sequelizeの初期化
	for (const databaseProvider of databaseProviders) {
		const sequelize = await databaseProvider.useFactory();
		// マスタ以外のDBは作り直し
		if (databaseProvider.provide !== 'MasterSequelizeToken') {
			await sequelize.drop();
			await sequelize.sync();
		}
	}

	// Redisの初期化
	await getClient(config['redis']['redis']).flushdbAsync();

	// 最新マスタの探索
	// ※ 高速化のためテスト用マスタのインポートはfulltestコマンド時しかしていないのでチェック
	await MasterVersion.sync();
	const version = await MasterVersion.findLatest();
	assert(version, 'Master data is not imported. Please try to "npm run fulltest".');
	versionId = version.id;

	// テスト用管理者登録
	await Administrator.create({ name: 'admin', role: 'admin', password: 'admin01' });
});

beforeEach('global initialization for each test', async () => {
	// 実行コンテキストのモック化
	// ※ runにdoneを渡してもダメだったので、モックにしてとりあえず動くようにする
	invokeContext.useMock();
	invokeContext.setDate();
	invokeContext.setMasterVersion(versionId);
});
