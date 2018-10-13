/**
 * 「ローグライクなMMOブラウザゲーム」サーバーバッチ共通モジュール。
 * @module ./batch/core
 */
import * as config from 'config';
import * as log4js from 'log4js';

// log4jsの初期化
log4js.configure(config['log4js']);
const logger = log4js.getLogger('batch');

// バッチ開始ログの出力
const name = process.argv.join(' ');
logger.info(name + " : started");

// バッチ終了ログの出力
// ※ イベントでバッチ終了に割り込む
process.on('exit', (code) => {
	if (code) {
		logger.error(`${name} : failed (${code})`);
	} else {
		logger.info(`${name} : finished`);
	}
});
process.on('uncaughtException', (err) => {
	log4js.getLogger('error').error(err);
	process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
	log4js.getLogger('error').error(reason);
	process.exit(1);
});
