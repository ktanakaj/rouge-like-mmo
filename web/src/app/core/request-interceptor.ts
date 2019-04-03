/**
 * HTTPリクエストのインターセプター。
 * @module ./app/core/request-interceptor
 */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { mergeMap, retryWhen } from 'rxjs/operators';

/**
 * 汎用のリトライストラテジー。
 * https://www.learnrxjs.io/operators/error_handling/retrywhen.html
 */
export const genericRetryStrategy = ({
	maxRetryAttempts = 3,
	scalingDuration = 1000,
	excludedStatusCodes = []
}: {
	maxRetryAttempts?: number,
	scalingDuration?: number,
	excludedStatusCodes?: number[]
} = {}) => (attempts: Observable<any>) => {
	return attempts.pipe(
		mergeMap((error, i) => {
			// 最大回数に到達するか、ステータスコードが対象外の場合、例外を投げる
			const retryAttempt = i + 1;
			if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
				return throwError(error);
			}
			console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
			// リトライごとにウェイトを入れる
			return timer(retryAttempt * scalingDuration);
		})
	);
};

/**
 * HTTPリクエストのインターセプタークラス。
 */
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
	/**
	 * HTTPリクエストに割り込み共通処理を実施する。
	 * @param req HTTPリクエスト。
	 * @param next HTTPハンドラー。
	 * @returns HTTPイベント。
	 */
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// エラーの場合、リトライ実施
		return next.handle(req)
			.pipe(retryWhen(genericRetryStrategy({
				excludedStatusCodes: [400, 401, 403, 404, 409, 422]
			})));
	}
}
