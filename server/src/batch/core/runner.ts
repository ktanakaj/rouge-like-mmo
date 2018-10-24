/**
 * 「ローグライクなMMOブラウザゲーム」ゲームサーバーバッチ用初期化モジュール。
 *
 * Nest周りの初期化等。インポートに時間が掛かることがあったので、別途参照できるよう分割。
 * @module ./batch/core/runner
 */
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { DebugLoggerService } from '../../shared/debug-logger.service';
import { AppModule } from '../../app.module';
import invokeContext from '../../shared/invoke-context';

/**
 * 「ローグライクなMMOブラウザゲーム」ゲームサーバーのアプリケーションを生成する。
 * @param callback アプリケーションを受け取るコールバック。
 */
export default function (callback: (app?: INestApplicationContext) => any): void {
	NestFactory.createApplicationContext(AppModule, {
		logger: new DebugLoggerService(),
	}).then((app) => {
		return invokeContext.setLatestMasterVersion()
			.then(() => callback(app));
	});
}
