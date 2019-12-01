/**
 * アクセスログを出力するNestミドルウェア。
 * @module ./core/middlewares/access-logger.middleware
 */
import { Injectable, NestMiddleware } from '@nestjs/common';
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
	use(req: express.Request, res: express.Response, next: express.NextFunction) {
		responseBodyCollector(req, res, (err) => {
			if (err) {
				return next(err);
			}
			this.connectLogger()(req, res, next);
		});
	}

	/**
	 * ロガーを生成する。
	 * @returns ロガー。
	 */
	connectLogger(): any {
		// ※ 現状フォーマットはほぼデフォルトのため、必要に応じて変更してください
		const option = {
			level: 'auto',
			nolog: config['noaccesslog'],
		};
		if (!config['debug']['bodyLog']) {
			return log4js.connectLogger(logger, option);
		}

		// bodyログが有効な場合、リクエスト/レスポンスボディ/プレイヤーor管理者IDも出力
		option['format'] = (req: express.Request, res: express.Response, format: (str: string) => string) => {
			const reqBody = this.hidePasswordLog(JSON.stringify(req.body));
			const resBody = this.hidePasswordLog((res as any)._getData());
			const id = req['user'] ? req['user']['id'] : '-';
			return format(':remote-addr - ' + id + ' ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"')
				+ ' req=' + reqBody + ' res=' + resBody;
		};
		return log4js.connectLogger(logger, option);
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
