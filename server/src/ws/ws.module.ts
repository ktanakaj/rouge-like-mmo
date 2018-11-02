/**
 * WebSocket APIルートモジュール。
 * @module ./ws/ws.module
 */
import { Module } from '@nestjs/common';
import { GameService } from './games/game.service';
import { AuthController } from './auth/auth.controller';
import { GameController } from './games/game.controller';

/**
 * WebSocket APIルートモジュールクラス。
 */
@Module({
	controllers: [AuthController, GameController],
	providers: [GameService],
})
export class WsModule { }
