/**
 * sequelize-cli実行スクリプト。
 * @module ./batch/db-migrate
 */
import './core';
import { ExitCode } from './core/exit-code';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as config from 'config';
import * as log4js from 'log4js';
import * as minimist from 'minimist';
import { Options } from 'sequelize';
const logger = log4js.getLogger('batch');

const BIN = 'node_modules/sequelize-cli/lib/sequelize';

// 引数チェック
const argv = minimist(process.argv.slice(2), { string: ['db', 'to'] });
const dbname = argv['db'];
const undo = argv['undo'];
const all = argv['all'];
const toscript = argv['to'];

if ((dbname !== undefined && dbname === '')
	|| (toscript !== undefined && toscript === '')) {
	logger.warn('Usage: npm run db-migrate -- [--undo] [--all] [--db=dbname] [--to=scriptname]');
	process.exit(ExitCode.Usage);
}
if (dbname && !config['databases'][dbname]) {
	logger.warn(`"${dbname}" is not found.`);
	process.exit(ExitCode.DataErr);
}

async function bootstrap() {
	const dbkeys = dbname ? [dbname] : Object.keys(config['databases']);

	// 全DB or 指定されたDBに対して sequelize-cli のマイグレーションを実行
	// ※ 非同期で並列に流せば高速化できるが、ログが分かり辛くなるので保留
	for (const dbkey of dbkeys) {
		const dbconfig = config['databases'][dbkey];
		const scriptsDir = __dirname + '/migrations/' + dbkey + '/';
		if (!fs.existsSync(scriptsDir)) {
			continue;
		}

		// シャーディングDBの場合は、各シャードに対して繰り返し実行
		for (const conf of dbconfig['databases'] || [dbconfig]) {
			// sequelize-cli のコマンドを生成
			let command = `${BIN} db:migrate`;

			if (undo) {
				// undoオプションの場合は、undo用のコマンドにする
				command += ':undo';

				// allまたはtoがある場合はallオプションも付ける
				if (all || toscript) {
					command += ':all';
				}
			}

			// 接続情報やマイグレーションパスを動的に変えるため、引数で渡す
			const url = makeConnectionUri(conf);
			command = `${command} --url '${url}' --migrations-path ${scriptsDir}`;

			if (toscript) {
				command += ` --to ${toscript}`;
			}

			// コマンドを実行
			let commandLog = command;
			if (conf['password']) {
				commandLog = commandLog.replace(conf['password'], '******');
			}
			logger.info(commandLog);
			await new Promise((resolve, reject) => child_process.exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
				logger.info(stdout);
				if (stderr) {
					logger.warn(stderr);
				}
				if (error) {
					reject(error);
				} else {
					resolve();
				}
			}));
		}
	}

	process.exit(0);
}
bootstrap();

/**
 * DB接続用のURLを作成する。
 * @param options DB接続情報。
 * @returns DB接続用URL。
 */
function makeConnectionUri(options: Options): string {
	// ※ 現状、optionsは以下のパラメータで入ってくる想定の決め打ち。ない可能性がある場合は要修正
	switch (options.dialect) {
		case 'sqlite':
			return `${options.dialect}:${options.storage}`;
		default:
			return `${options.dialect}://${options.username}:${options.password}@${options.host}:${options.port}/${options.database}`;
	}
}
