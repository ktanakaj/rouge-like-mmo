/**
 * ルーティング関連のヘルパーモジュール。
 * @module ./app/core/routing-helper
 */
import { ParamMap } from '@angular/router';

/**
 * クエリーパラメータを数値として取得する。
 * @param params クエリーパラメータマップ。
 * @param key キー名。
 * @param defaultValue デフォルト値。
 * @returns クエリー値。未設定or数値以外はデフォルト値。デフォルト値が無い場合はundefined。
 */
function getQueryParamAsNumber(params: ParamMap, key: string, defaultValue?: number): number {
	const value = params.get(key);
	if (value) {
		const num = Number(value);
		if (!isNaN(num)) {
			return num;
		}
	}
	return defaultValue;
}

/**
 * クエリーパラメータを真偽値として取得する。
 * @param params クエリーパラメータマップ。
 * @param key キー名。
 * @param defaultValue デフォルト値。
 * @returns クエリー値。未設定はデフォルト値。デフォルト値が無い場合はundefined。
 */
function getQueryParamAsBoolean(params: ParamMap, key: string, defaultValue?: boolean): boolean {
	const value = params.get(key);
	if (value === undefined || value === null || value === '') {
		return defaultValue;
	}
	return value === '1' || value === 'true' || value === 'True' || value === 'TRUE';
}

/**
 * クエリーパラメータを日時として取得する。
 * @param params クエリーパラメータマップ。
 * @param key キー名。
 * @param defaultValue デフォルト値。
 * @returns クエリー値。未設定or日時以外はデフォルト値。デフォルト値が無い場合はundefined。
 */
function getQueryParamAsDate(params: ParamMap, key: string, defaultValue?: Date): Date {
	const value = params.get(key);
	if (value) {
		const date = new Date(value);
		if (date && date.toString() !== 'Invalid Date') {
			return date;
		}
	}
	return defaultValue;
}

export default {
	getQueryParamAsNumber,
	getQueryParamAsBoolean,
	getQueryParamAsDate,
};
