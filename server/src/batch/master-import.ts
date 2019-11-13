/**
 * マスタインポートスクリプト。
 * @module ./batch/master-import
 */
import './core';
import { ExitCode } from './core/exit-code';
import * as path from 'path';
import * as fs from 'fs';
import * as log4js from 'log4js';
import * as minimist from 'minimist';
import { fileUtils } from '../core/utils';

const logger = log4js.getLogger('batch');

// 引数チェック
const argv = minimist(process.argv.slice(2), { boolean: true });
let dir = argv._.shift();
if (!dir) {
	logger.warn('Usage: npm run master-import -- directory');
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
import { importMaster } from '../shared/master-importer';

run(async () => {
	// ※ 現状ログの視認性などを鑑みて並列実行していない
	for (const csvpath of files) {
		await importMaster(csvpath);
	}
	process.exit(0);
});
