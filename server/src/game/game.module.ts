/**
 * ゲーム用APIルートモジュール。
 * @module ./game/game.module
 */
import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { MastersController } from './system/masters.controller';
import { EnvController } from './system/env.controller';
import { GameController } from './games/game.controller';
import { PlayerCharactersController } from './games/player-characters.controller';

/**
 * ゲーム用APIルートモジュールクラス。
 */
@Module({
	controllers: [
		AuthController,
		MastersController,
		EnvController,
		GameController,
		PlayerCharactersController,
	],
})
export class GameModule { }
