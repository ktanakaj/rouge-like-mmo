/**
 * WebSocket APIルートモジュール。
 * @module ./ws/ws.module
 */
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';

/**
 * WebSocket APIルートモジュールクラス。
 */
@Module({
	controllers: [AuthController],
})
export class WsModule { }
