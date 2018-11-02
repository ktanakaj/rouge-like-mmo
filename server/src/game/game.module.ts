/**
 * ゲーム用APIルートモジュール。
 * @module ./game/game.module
 */
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { GameController } from './games/game.controller';

/**
 * ゲーム用APIルートモジュールクラス。
 */
@Module({
	controllers: [AuthController, GameController],
})
export class GameModule { }
