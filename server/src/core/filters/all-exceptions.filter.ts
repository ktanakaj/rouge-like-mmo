/**
 * アプリ全体用の例外処理モジュール。
 * @module ./core/filters/all-exceptions.filter.ts
 */
import { Catch, ArgumentsHost, ExceptionFilter, RpcExceptionFilter, HttpException } from '@nestjs/common';
import { Observable, from } from 'rxjs';
import * as express from 'express';
import * as config from 'config';
import * as log4js from 'log4js';
import { JsonRpcError } from 'json-rpc2-implementer';
import { isWebSocketRpc } from '../ws';
import { isRedisRpc } from '../redis';
import { AppError } from '../errors';
import { ErrorCode } from '../db';

const errorLogger = log4js.getLogger('error');

/**
 * アプリ全体用の例外処理クラス。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter, RpcExceptionFilter {
	/**
	 * 例外をキャッチする。
	 * @param exception 発生した例外。
	 * @param host 各種情報。
	 * @returns 処理状態。
	 */
	catch(exception: any, host: ArgumentsHost): Observable<any> {
		return from(this.asyncCatch(exception, host));
	}

	/**
	 * 例外をキャッチする。
	 * @param err 発生した例外。
	 * @param host 各種情報。
	 * @returns 処理状態。
	 */
	protected async asyncCatch(err: any, host: ArgumentsHost): Promise<void> {
		// エラーは一旦AppErrorへと変換して、かつマスタからログレベル等を取得して処理する。
		const apperr = AppError.convert(err);
		const errorCode = await this.findByErrorCode(apperr.code);

		// ※ ログにはオリジナルのエラーを出す
		this.log(err, apperr, errorCode.logLevel);

		if (isWebSocketRpc(host) || isRedisRpc(host)) {
			// RPCではJsonRpcErrorとしてスローする
			throw new JsonRpcError(errorCode.id, apperr.message, apperr.data);
		} else {
			// HTTPではエラーレスポンスを出力する
			this.sendErrorResponse(host.switchToHttp().getResponse(), apperr, errorCode);
		}
	}

	/**
	 * エラーコードマスタを取得する。
	 * @param code エラーコード。
	 * @returns エラーコードマスタ。取得失敗時はデフォルト値。
	 */
	protected async findByErrorCode(code: string): Promise<ErrorCode> {
		let errorCode;
		try {
			errorCode = await ErrorCode.findByErrorCode(code);
		} catch (e) {
			errorLogger.error(e);
		}
		return errorCode || ErrorCode.build({ id: 0, responseCode: 500, logLevel: 'error' });
	}

	/**
	 * 例外ログを出力する。
	 * @param err 発生した例外。
	 * @param apperr 例外を元に生成したAppError。
	 * @param level ログレベル。
	 */
	protected log(err: any, apperr: AppError, level: string): void {
		if (err instanceof HttpException) {
			// NestのHttpExceptionはtoStringが読み辛いのでAppError用に成形したものを使用
			err.name = err.constructor.name;
			// ※ readonlyだけど無理やり上書き
			(err as Error).message = apperr.message;
		}
		errorLogger[level](err);
	}

	/**
	 * エラーレスポンスを出力する。
	 * @param res レスポンス。
	 * @param err 出力するエラー。
	 * @param errorCode エラーコードマスタ。
	 */
	protected sendErrorResponse(res: express.Response, err: AppError, errorCode: ErrorCode): void {
		if (res.headersSent) {
			return;
		}

		res.status(errorCode.responseCode);
		res.json({
			error: {
				code: errorCode.id,
				// 本番環境等ではエラーの詳細は返さない
				message: config['debug']['errorMessage'] ? err.message : err.code,
				data: err.data,
			},
		});
	}
}
