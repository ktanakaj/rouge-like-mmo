/**
 * GMツール用APIルートモジュール。
 * @module ./admin/admin.module
 */
import { Module } from '@nestjs/common';
import { AdministratorsController } from './administrators/administrators.controller';
import { MastersController } from './masters/masters.controller';
import { PlayersController } from './players/players.controller';

/**
 * GMツール用APIルートモジュールクラス。
 */
@Module({
	controllers: [
		AdministratorsController,
		MastersController,
		PlayersController,
	],
})
export class AdminModule { }
