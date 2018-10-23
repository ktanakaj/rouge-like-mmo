/**
 * アクセスログを出力するNestミドルウェア。
 * @module ./shared/access-logger.middleware
 */
import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import * as express from 'express';
import * as config from 'config';
import * as log4js from 'log4js';
import responseBodyCollector from './response-body-collector.middleware';

const logger = log4js.getLogger('access');

/**
 * アクセスログを出力するミドルウェア。
 */
@Injectable()
export class AccessLoggerMiddleware implements NestMiddleware {
	resolve(): MiddlewareFunction {
		// ※ 現状フォーマットはほぼデフォルトのため、必要に応じて変更してください
		const option = {
			level: 'auto',
			nolog: config['noaccesslog'],
		};
		if (!config['debug']['bodyLog']) {
			return log4js.connectLogger(logger, option);
		}

		// bodyログが有効な場合、リクエスト/レスポンスボディも出力
		option['format'] = (req: express.Request, res: express.Response, format: (str: string) => string) => {
			const reqBody = this.hidePasswordLog(JSON.stringify(req.body));
			const resBody = this.hidePasswordLog((res as any)._getData());
			return format(':remote-addr - - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent" req=')
				+ reqBody + ' res=' + resBody;
		};
		const loggerHandler = log4js.connectLogger(logger, option);

		// レスポンス保存用ミドルウェアでラップする
		return (req, res, next) => {
			responseBodyCollector(req, res, (err) => {
				if (err) {
					return next(err);
				}
				loggerHandler(req, res, next);
			});
		};
	}

	/**
	 * JSONログ上のパスワードを隠す。
	 * @param log JSONログ文字列。
	 * @returns パスワードを置換したログ文字列。
	 */
	hidePasswordLog(log: string): string {
		// TODO: パスワードに"が含まれていると中途半端になるかも
		if (log === null || log === undefined) {
			return log;
		}
		return log.replace(/("password"\s*:\s*)".*?"/gi, '$1"****"');
	}
}