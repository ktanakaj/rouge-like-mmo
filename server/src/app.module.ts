/**
 * ゲームサーバールートモジュール。
 * @module ./app.module
 */
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { databaseProviders } from './shared/database.providers';
import { AccessLoggerMiddleware } from './shared/access-logger.middleware';
import { GameModule } from './game/game.module';
import { AdminModule } from './admin/admin.module';

/**
 * ゲームサーバールートモジュールクラス。
 */
@Module({
	imports: [GameModule, AdminModule],
	providers: [...databaseProviders],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AccessLoggerMiddleware)
			.forRoutes({ path: '*', method: RequestMethod.ALL });
	}
}
