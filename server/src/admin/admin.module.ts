/**
 * GMツール用APIルートモジュール。
 * @module ./admin/admin.module
 */
import { Module } from '@nestjs/common';
import { AdministratorsController } from './administrators/administrators.controller';
import { MastersController } from './masters/masters.controller';

/**
 * GMツール用APIルートモジュールクラス。
 */
@Module({
	controllers: [AdministratorsController, MastersController],
})
export class AdminModule { }
