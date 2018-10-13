/**
 * 「ローグライクなMMOブラウザゲーム」サーバーバッチ用初期化モジュール。
 *
 * Nest周りの初期化等。2018年9月現在インポートだけで10秒近くかかるので、
 * 必要が無い場合は参照しないことを推奨。
 * @module ./batch/core/init
 */
import { NestFactory } from '@nestjs/core';
import { DebugLoggerService } from '../../shared/debug-logger.service';
import { AppModule } from '../../app.module';
import MasterVersion from '../../shared/master-version.model';

const afterInit = NestFactory.createApplicationContext(AppModule, {
	logger: new DebugLoggerService(),
}).then((app) => {
	return MasterVersion.sync() //TODO: syncは止める
		.then(() => MasterVersion.zoneMasterVersion())
		.then(() => app);
});

/** アプリケーション初期化のPromise */
export default afterInit;
