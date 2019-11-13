/**
 * マスタインポート処理。
 * @module ./shared/master-importer
 */
import * as path from 'path';
import * as _ from 'lodash';
import * as log4js from 'log4js';
import * as csvtojson from 'csvtojson';
import { MODELS } from './database.providers';
const logger = log4js.getLogger('batch');

// ※ 元々はバッチの中にあったが、ユニットテストで直接呼びたかったので移動

/**
 * 指定されたCSVマスタファイルをインポートする。
 * @param csvpath CSVパス。
 * @return 処理状態。
 */
export async function importMaster(csvpath: string): Promise<void> {
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
