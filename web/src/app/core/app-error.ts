/**
 * アプリケーション例外のモジュール。
 * @module ./app/core/app-error
 */
import { HttpErrorResponse } from '@angular/common/http';

/**
 * アプリケーションエラーを格納する例外クラス。
 *
 * サーバー側のエラー情報に対応する。
 */
export class AppError extends Error {
	/** エラーコード */
	readonly code: number;
	/** エラーごとの追加情報 */
	readonly data: any;
	/** HTTPステータスコード */
	status = 0;

	/**
	 * 例外を生成する。
	 * @param message エラーメッセージ。
	 * @param code エラーコード。
	 * @param data 追加のエラー情報。
	 */
	constructor(message: string, code: number, data?: any) {
		super(message);
		this.name = 'AppError';
		this.code = code;
		this.data = data;
	}

	/**
	 * エラー情報をAppErrorとして解析する。
	 * @param err 解析元の例外。
	 * @return 解析したAppError。解析できない場合はnull。
	 */
	static parse(err: any): AppError {
		if (err instanceof AppError) {
			// AppErrorが渡された場合何もしない。
			return err;
		} else if (err instanceof HttpErrorResponse) {
			// サーバーからエラー情報が来ている場合、それをクライアントのAppErrorに変換する。
			// ※ ただし、たまたま同じようなフォーマットを返す外部サービスの可能性もあるので、
			//    値が無い場合はHttpErrorResponseの情報も詰める。
			if (err.error && err.error.error) {
				const svrErr = err.error.error;
				if (svrErr.code) {
					const appErr = new AppError(svrErr.message || err.message, svrErr.code, svrErr.data);
					appErr.status = err.status;
					return appErr;
				}
			}
		}
		return null;
	}
}
