/**
 * 「ローグライクなMMOブラウザゲーム」サーバールートモジュール。
 * @module ./app.module
 */
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { databaseProviders } from './shared/database.providers';
import MasterVersionMiddleware from './shared/master-version.middleware';
import { AccessLoggerMiddleware } from './shared/access-logger.middleware';
import { GameModule } from './game/game.module';
import { AdminModule } from './admin/admin.module';

/**
 * 「ローグライクなMMOブラウザゲーム」サーバールートモジュールクラス。
 */
@Module({
	imports: [GameModule, AdminModule],
	providers: [...databaseProviders],
	exports: [...databaseProviders],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(MasterVersionMiddleware, AccessLoggerMiddleware)
			.forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}

