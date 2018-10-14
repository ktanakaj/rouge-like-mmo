/**
 * ゲーム用APIルートモジュール。
 * @module ./game/game.module
 */
import { Module } from '@nestjs/common';
import { GamesController } from './games/games.controller';

/**
 * ゲーム用APIルートモジュールクラス。
 */
@Module({
	controllers: [GamesController],
})
export class GameModule { }
