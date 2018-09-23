/**
 * アプリ全体用の例外処理モジュール。
 * @module ./core/all-exceptions.filter.ts
 */

import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import * as http from 'http';
import * as config from 'config';
import * as log4js from 'log4js';
import { AppError } from './errors';
import ErrorCode from '../shared/error-code.model';

const errorLogger = log4js.getLogger('error');

/**
 * アプリ全体用の例外処理クラス。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	/**
	 * 例外をキャッチする。
	 * @param exception 発生した例外。
	 * @param host 各種情報。
	 * @returns 処理状態。
	 */
	async catch(exception: any, host: ArgumentsHost): Promise<void> {
		const ctx = host.switchToHttp();
		const res = ctx.getResponse();

		// エラーの内容によってログ出力を制御する
		// ・バリデーションエラーなどサーバーとしては正常なものはエラーログに出さない
		// ・それ以外のサーバーのエラーや想定外のものはログに出す
		const appError = AppError.convert(exception);
		let errorCode = null;
		try {
			errorCode = await ErrorCode.findByErrorCode(appError.code);
		} catch (e) {
			errorLogger.fatal(e);
		}

		let logLevel = 'error';
		if (errorCode && errorLogger[errorCode.logLevel]) {
			logLevel = errorCode.logLevel;
		}
		// ※ ログにはオリジナルのエラーを出す
		errorLogger[logLevel](exception);

		// レスポンスコードなどもエラーの内容に応じて制御する
		if (res.headersSent) {
			return;
		}

		const status = errorCode ? errorCode.responseCode : 500;
		res.status(status);
		res.json({
			error: {
				code: appError.code,
				// 本番環境等ではエラーの詳細は返さない
				message: config['debug']['errorMessage'] ? appError.message : http.STATUS_CODES[status],
				data: appError.data,
			}
		});
	}
}