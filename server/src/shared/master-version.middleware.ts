/**
 * 処理で使用するマスタバージョンを決定するexpressミドルウェア。
 * @module ./shared/master-version.middleware
 */
import * as express from 'express';
import MasterVersion from './master-version.model';

/**
 * 処理で使用するマスタバージョンを決定するミドルウェア。
 * @param req リクエスト。
 * @param res レスポンス。
 * @param next 次の処理呼び出し用のコールバック。
 */
export default function (req: express.Request, res: express.Response, next: express.NextFunction): void {
	MasterVersion.zoneMasterVersion().then(next).catch(next);
}