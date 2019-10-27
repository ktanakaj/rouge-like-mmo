/**
 * マスタインポートスクリプト。
 * @module ./batch/master-import
 */
import './core';
import { ExitCode } from './core/exit-code';
import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as log4js from 'log4js';
import * as csvtojson from 'csvtojson';
import * as minimist from 'minimist';
import { fileUtils } from '../core/utils';

const logger = log4js.getLogger('batch');

// 引数チェック
const argv = minimist(process.argv.slice(2), { boolean: true });
let dir = argv._.shift();
if (!dir) {
	logger.warn('Usage: npm run master-import -- directory [--publish]');
	process.exit(ExitCode.Usage);
}
if (!path.isAbsolute(dir)) {
	dir = path.resolve(dir);
}
if (!fs.existsSync(dir)) {
	logger.warn(`"${dir}" is not found.`);
	process.exit(ExitCode.DataErr);
}
if (!fs.lstatSync(dir).isDirectory()) {
	logger.warn(`"${dir}" is not directory.`);
	process.exit(ExitCode.DataErr);
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
	process.exit(ExitCode.DataErr);
}

// マスタファイルをインポート
import run from './core/runner';
import { MODELS } from '../shared/database.providers';

run(async () => {
	// ※ 現状ログの視認性などを鑑みて並列実行していない
	for (const csvpath of files) {
		await importMaster(csvpath);
	}
	process.exit(0);
});

/**
 * 指定されたCSVマスタファイルをインポートする。
 * @param csvpath CSVパス。
 * @return 処理状態。
 */
async function importMaster(csvpath: string): Promise<void> {
	logger.info(`${csvpath} : importing...`);

	// CSVファイルのファイル名をマスタ名とみなしてモデルクラス取得
	const name = _.upperFirst(_.camelCase(path.basename(csvpath, '.csv')));
	const model = MODELS.master.find((m) => m.name === name);
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
			for (const key in json) {
				params[_.camelCase(_.snakeCase(key))] = json[key];
			}
			try {
				await (model as any).create(params);
				++imported;
			} catch (e) {
				// 例外になるのは主にバリデーションエラー
				logger.error((e.message ? e.message.replace('\n', ' ') : e) + ' (' + JSON.stringify(json) + ')');
				++rejected;
			}
		});

	if (rejected > 0) {
		logger.error(`${csvpath} : ${imported} records were imported, ${rejected} records were rejected.`);
	} else {
		logger.info(`${csvpath} : ${imported} records were imported.`);
	}
}
