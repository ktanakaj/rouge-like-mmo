/**
 * 「無を掴め」サーバールートモジュール。
 * @module ./app.module
 */
import { Module } from '@nestjs/common';
import { databaseProviders } from './shared/database.providers';
import { GameModule } from './game/game.module';
import { AdminModule } from './admin/admin.module';

/**
 * 「無を掴め」サーバールートモジュールクラス。
 */
@Module({
	imports: [GameModule, AdminModule],
	providers: [...databaseProviders],
	exports: [...databaseProviders],
})
export class AppModule { }
