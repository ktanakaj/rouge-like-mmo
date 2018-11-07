/**
 * WebSocket APIルートモジュール。
 * @module ./ws/ws.module
 */
import { Module } from '@nestjs/common';
import { GameService } from './games/game.service';
import { PlayersController } from './players/players.controller';
import { GameController } from './games/game.controller';

/**
 * WebSocket APIルートモジュールクラス。
 */
@Module({
	controllers: [PlayersController, GameController],
	providers: [GameService],
})
export class WsModule { }
