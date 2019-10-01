/**
 * レスポンスボディを参照用に保存するexpressミドルウェア。
 * @module ./shared/response-body-collector.middleware
 */
import * as express from 'express';

/**
 * レスポンスボディ出力にフックして、res._getData() で参照できるようにするミドルウェア。
 *
 * レスポンスのサイズが大きい場合問題となる可能性があるため、本番環境での運用は注意。
 * @param req リクエスト。
 * @param res レスポンス。
 * @param next 次の処理呼び出し用のコールバック。
 */
export default function (req: express.Request, res: express.Response, next: express.NextFunction): void {
	const chunks = [];

	// 通常の write や end にフックする
	function applyWithPushChunk(f: Function) {
		return function (chunk: string | Buffer, encoding?: BufferEncoding) {
			if (chunk !== undefined && chunk !== null && chunk !== '') {
				if (typeof chunk === 'string') {
					chunks.push(Buffer.from(chunk, encoding));
				} else {
					chunks.push(chunk);
				}
			}
			f.apply(res, arguments);
		};
	}
	res.write = applyWithPushChunk(res.write) as any;
	res.end = applyWithPushChunk(res.end) as any;

	// 動的に結果取得メソッドを追加
	res['_getData'] = function () { return Buffer.concat(chunks).toString('utf8'); };

	next();
}