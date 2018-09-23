/**
 * デバッグログを出力するNestサービス。
 * @module ./shared/debug-logger.service
 */
import { LoggerService } from '@nestjs/common';
import * as log4js from 'log4js';

const logger = log4js.getLogger('debug');

/**
 * デバッグログを出力するサービスクラス。
 */
export class DebugLoggerService implements LoggerService {
	/**
	 * ログを出力する。
	 * @param message メッセージ。
	 * @param context 発生したコンテキスト。
	 */
	log(message: string, context?: string): void {
		logger.debug(this.formatMessage(message, context));
	}

	/**
	 * エラーログを出力する。
	 * @param message メッセージ。
	 * @param trace スタックトレース。
	 * @param context 発生したコンテキスト。
	 */
	error(message: string, trace?: string, context?: string): void {
		logger.error(this.formatMessage(message, context), trace);
	}

	/**
	 * 警告ログを出力する。
	 * @param message メッセージ。
	 * @param context 発生したコンテキスト。
	 */
	warn(message: string, context?: string): void {
		logger.warn(this.formatMessage(message, context));
	}

	/**
	 * ログメッセージを成形する。
	 * @param message メッセージ。
	 * @param context 発生したコンテキスト。
	 * @returns 成形したメッセージ。
	 */
	private formatMessage(message: string, context?: string): string {
		return context ? `[${context}] ${message}` : message;
	}
}
