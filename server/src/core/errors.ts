/**
 * 業務エラーの例外クラスモジュール。
 *
 * 汎用的な例外クラスと、頻出する例外用のクラスを定義。
 * @module ./core/errors
 */
import { HttpException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from 'sequelize';

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

		// 例外クラスまたは例外名を元に各エラーの内容に合わせて変換
		if (err instanceof AppError) {
			return err;
		} else if (err instanceof HttpException) {
			return this.fromHttpException(err);
		} else if (err) {
			switch (err.name) {
				// ※ 以下のSequelizeの例外はinterfaceなのでnameで判別
				case 'SequelizeUniqueConstraintError':
					return this.fromUniqueConstraintError(err);
				case 'SequelizeValidationError':
					return this.fromValidationError(err);
			}
		}

		// その他のエラーは、サーバーエラーに変換
		return new InternalServerError(err.message || err, err);
	}

	/**
	 * NestのHttpExceptionを変換する。
	 * @param err 変換元の例外。
	 * @returns 変換後の例外。
	 */
	private static fromHttpException(err: HttpException): AppError {
		const msg = this.formatHttpExceptionMsg(err.message);
		switch (err.getStatus()) {
			case 400:
				return new BadRequestError(msg, err);
			case 401:
				const newErr401 = new UnauthorizedError(msg);
				newErr401.cause = err;
				return newErr401;
			case 403:
				const newErr403 = new ForbiddenError(msg);
				newErr403.cause = err;
				return newErr403;
			case 404:
				return new BadRequestError(msg, err);
			case 405:
				const newErr405 = new AppError(msg, 'METHOD_NOT_ALLOWED');
				newErr405.cause = err;
				return newErr405;
			case 408:
				const newErr408 = new AppError(msg, 'REQUEST_TIMEOUT');
				newErr408.cause = err;
				return newErr408;
			case 409:
				const newErr409 = new ConflictError(msg);
				newErr409.cause = err;
				return newErr409;
			case 429:
				const newErr429 = new AppError(msg, 'TOO_MANY_REQUESTS');
				newErr429.cause = err;
				return newErr429;
			case 501:
				const newErr501 = new AppError(msg, 'NOT_IMPLEMENTED');
				newErr501.cause = err;
				return newErr501;
			case 503:
				const newErr503 = new AppError(msg, 'SERVICE_UNAVAILABLE');
				newErr503.cause = err;
				return newErr503;
			default:
				return new InternalServerError(msg, err);
		}
	}

	/**
	 * NestのHttpExceptionのメッセージを整形する。
	 * @param err 変換元の例外。
	 * @returns 変換後の例外。
	 */
	private static formatHttpExceptionMsg(message: any): string {
		// 基本的にどのケースでも { statusCode, error, message } のobjectで来るようなのでそれを処理
		if (message === null || typeof message !== 'object') {
			return message;
		}
		const msg = message.message;
		if (!msg) {
			// 不明なフォーマットなのでとりあえずJSONで返す
			return JSON.stringify(message);
		}
		if (msg === null || typeof msg !== 'object') {
			// 文字列が入っているだけならそのまま
			return msg;
		}
		if (Array.isArray(msg) && msg[0] instanceof ValidationError) {
			// バリデーションNG配列の場合はエラー情報を文字列につなげる
			return msg.map((e) => String(e)).join(', ');
		}
		// 不明なフォーマットなのでとりあえずJSONで返す
		return JSON.stringify(msg);
	}

	/**
	 * Sequelizeの一意制約違反エラーを変換する。
	 * @param err 変換元の例外。
	 * @returns 変換後の例外。
	 */
	private static fromUniqueConstraintError(err: UniqueConstraintError): AppError {
		let name = '';
		let value = '';
		if (Array.isArray(err.errors) && err.errors[0]) {
			value = err.errors[0].value;
			if (err.errors[0]['instance']) {
				name = err.errors[0]['instance']['constructor']['name'];
			}
		}
		const newErr = new ConflictError(name, value);
		newErr.cause = err;
		return newErr;
	}

	/**
	 * Sequelizeのバリデーションエラーを変換する。
	 * @param err 変換元の例外。
	 * @returns 変換後の例外。
	 */
	private static fromValidationError(err: SequelizeValidationError): AppError {
		return new BadRequestError(Array.isArray(err.errors) ? err.errors.map((e) => e.message || '').join(', ') : '', err);
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
	 * @param name モデル名。
	 * @param id ID。
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

/**
 * データ競合の例外クラス。
 */
export class ConflictError extends AppError {
	/**
	 * 例外を生成する。
	 * @param name メッセージ。
	 * @param data エラーの追加情報。
	 */
	constructor(message: string, data?: object);
	/**
	 * 例外を生成する。
	 * @param name モデル名。
	 * @param id ID。
	 */
	constructor(name: string, id: number | string);
	constructor(messageOrName: string, dataOrId: any = null) {
		if (typeof dataOrId === 'object') {
			super(messageOrName, 'CONFLICT', dataOrId);
		} else {
			super(`id=${dataOrId} is found in ${messageOrName} data`, 'CONFLICT', { name: messageOrName, id: dataOrId });
		}
	}
}