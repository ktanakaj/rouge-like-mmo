/**
 * 業務エラーの例外クラスモジュール。
 *
 * 汎用的な例外クラスと、頻出する例外用のクラスを定義。
 * @module ./core/errors
 */

/**
 * 汎用の業務エラー例外クラス。
 */
export class AppError extends Error {
	/** エラーコード */
	code: string;
	/** エラーごとの追加情報 */
	data: any;
	/** 元になったエラーがある場合その情報 */
	cause: any;

	/**
	 * 例外を生成する。
	 * @param message エラーメッセージ。
	 * @param code エラーコード。
	 * @param data 追加のエラー情報。
	 */
	constructor(message: string, code: string, data?: any) {
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.data = data;
	}

	/**
	 * 各種のエラーをAppErrorに変換する。
	 * @param err 変換元のエラー。
	 * @returns 変換後のエラー。
	 */
	static convert(err: any): AppError {
		// request-promiseのtransformが投げるエラー。本来の例外がラップされるので中身を使用
		if (err && err.name === 'TransformError') {
			err = err.cause;
		}

		// 変換が不要な場合はそのまま返す
		if (err instanceof AppError) {
			return err;
		}

		if (err) {
			switch (err.name) {
				case 'SequelizeUniqueConstraintError':
					// Sequelizeが一意制約違反時に投げるエラー
					return new BadRequestError(err.message, err);
				case 'SequelizeValidationError':
					// SequelizeがバリデーションNG時に投げるエラー
					return new BadRequestError(Array.isArray(err.errors) ? err.errors.map((e) => e.message || "").join(", ") : '', err);
				case 'Error':
					// Nest.jsのバリデーションNGやルート未存在などが何故か標準のエラーで飛んでくるのでstatusで判別
					if (err.status !== undefined) {
						switch (err.status) {
							case 400:
								return new BadRequestError(JSON.stringify(err.message.message), err);
							case 404:
								return new BadRequestError(err.message.message, err);
						}
					}
			}
		}

		// その他のエラーは、サーバーエラーに変換
		return new InternalServerError(err.message || err, err);
	}
}

/**
 * サーバーエラーの例外クラス。
 */
export class InternalServerError extends AppError {
	/**
	 * 例外を生成する。
	 * @param message エラーメッセージ。
	 * @param cause 元になったエラーがある場合その情報。
	 */
	constructor(message: string, cause?: any) {
		super(message, 'INTERNAL_SERVER_ERROR');
		this.cause = cause;
	}
}

/**
 * 不正なリクエストの例外クラス。
 */
export class BadRequestError extends AppError {
	/**
	 * 例外を生成する。
	 * @param message エラーメッセージ。
	 * @param cause 元になったエラーがある場合その情報。
	 */
	constructor(message: string, cause?: any) {
		super(message, 'BAD_REQUEST');
		this.cause = cause;
	}
}

/**
 * セッション未存在の例外クラス。
 */
export class UnauthorizedError extends AppError {
	/**
	 * 例外を生成する。
	 * @param message エラーメッセージ。
	 */
	constructor(message: string) {
		super(message, 'UNAUTHORIZED');
	}
}

/**
 * 権限無しの例外クラス。
 */
export class ForbiddenError extends AppError {
	/**
	 * 例外を生成する。
	 * @param message エラーメッセージ。
	 */
	constructor(message: string) {
		super(message, 'FORBIDDEN');
	}
}

/**
 * データ無しの例外クラス。
 */
export class NotFoundError extends AppError {
	/**
	 * 例外を生成する。
	 * @param name メッセージ。
	 * @param data エラーの追加情報。
	 */
	constructor(message: string, data?: object);
	/**
	 * 例外を生成する。
	 * @param name リソース名。
	 * @param id リソースID。
	 */
	constructor(name: string, id: number | string);
	constructor(messageOrName: string, dataOrId: any = null) {
		if (typeof dataOrId === 'object') {
			super(messageOrName, 'NOT_FOUND', dataOrId);
		} else {
			super(`id=${dataOrId} is not found in ${messageOrName}`, 'NOT_FOUND', { name: messageOrName, id: dataOrId });
		}
	}
}
