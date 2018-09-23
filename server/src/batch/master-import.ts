/**
 * 「無を掴め」マスタインポートスクリプト。
 * @module ./batch/master-import
 */
import './core';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as log4js from 'log4js';
import * as csvtojson from 'csvtojson';
import * as minimist from 'minimist';
import fileUtils from '../core/utils/file-utils';

const logger = log4js.getLogger('batch');

// 引数チェック
const argv = minimist(process.argv.slice(2), { boolean: true });
let dir = argv._.shift();
if (!dir) {
	logger.warn("Usage: npm run master-import -- directory [--publish]");
	process.exit(64);
}
if (!path.isAbsolute(dir)) {
	dir = path.resolve(dir);
}
if (!fs.existsSync(dir)) {
	logger.warn(`"${dir}" is not found.`);
	process.exit(128);
}
if (!fs.lstatSync(dir).isDirectory()) {
	logger.warn(`"${dir}" is not directory.`);
	process.exit(128);
}

// マスタファイル一覧を取得
const files = [];
fileUtils.directoryWalkSync(dir, (f) => {
	if (/\.csv$/.test(f)) {
		files.push(f);
	}
});
if (files.length === 0) {
	logger.warn(`"${dir}" is empty.`);
	process.exit(128);
}

// インポート実施
import afterInit from './core/init';
import MasterVersion from '../shared/master-version.model';
import { MASTER_MODELS } from '../shared/database.providers';

afterInit.then(() => importMasters(files, argv['publish'])).then(() => process.exit(0));

/**
 * 指定されたCSVマスタファイル一式をインポートする。
 * @param csvpaths CSVパス配列。
 * @param publish インポート後に公開にする場合true。
 * @return 処理状態。
 */
async function importMasters(csvpaths: string[], publish: boolean): Promise<void> {
	// 新しいマスタバージョンを作成
	// ※ マスタバージョンテーブルが無い場合はテーブルも作る
	await MasterVersion.sync();
	const masterVersion = await MasterVersion.create();
	logger.info(`Master version v${masterVersion.id} : importing...`);

	// 作成したバージョンでマスタテーブルを作成し、インポート実行
	await MasterVersion.zoneMasterVersion(masterVersion.id);
	try {
		await MasterVersion.sequelize.sync();
		for (let csvpath of csvpaths) {
			await importMaster(csvpath);
		}
		masterVersion.status = publish ? 'published' : 'readied';
	} catch (err) {
		masterVersion.status = 'failed';
		throw err;
	} finally {
		logger.info(`Master version v${masterVersion.id} : ${masterVersion.status}.`);
		await masterVersion.save();
	}
}

/**
 * 指定されたCSVマスタファイルをインポートする。
 * @param csvpath CSVパス。
 * @return 処理状態。
 */
async function importMaster(csvpath: string): Promise<void> {
	logger.info(`${csvpath} : importing...`);

	// CSVファイルのファイル名をマスタ名とみなしてモデルクラス取得
	const name = _.upperFirst(_.camelCase(path.basename(csvpath, '.csv')));
	const model = MASTER_MODELS.find((m) => m.name === name);
	if (model === undefined) {
		logger.warn(name + ' is not found. skipped.');
		return;
	}

	// CSVのレコードを1件ずつモデルに変換して登録
	// TODO: データ量が増えて遅くなったら100件単位などのbulkCreateを検討する
	let imported = 0;
	let rejected = 0;
	await model.truncate();
	await csvtojson().fromFile(csvpath)
		.subscribe(async (json) => {
			const params = {};
			for (let key in json) {
				params[_.camelCase(_.snakeCase(key))] = json[key];
			}
			try {
				await (model as any).create(params);
				++imported;
			} catch (e) {
				// 例外になるのは主にバリデーションエラー
				logger.error((e.message ? e.message.replace("\n", " ") : e) + " (" + JSON.stringify(json) + ")");
				++rejected;
			}
		});

	if (rejected > 0) {
		logger.error(`${csvpath} : ${imported} records were imported, ${rejected} records were rejected.`);
	} else {
		logger.info(`${csvpath} : ${imported} records were imported.`);
	}
}