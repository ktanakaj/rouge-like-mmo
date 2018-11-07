/**
 * ゲーム用APIルートモジュール。
 * @module ./game/game.module
 */
import { Module } from '@nestjs/common';
import { MastersController } from './system/masters.controller';
import { EnvController } from './system/env.controller';
import { GameController } from './games/game.controller';
import { PlayersController } from './players/players.controller';
import { PlayerCharactersController } from './players/player-characters.controller';

/**
 * ゲーム用APIルートモジュールクラス。
 */
@Module({
	controllers: [
		MastersController,
		EnvController,
		GameController,
		PlayersController,
		PlayerCharactersController,
	],
})
export class GameModule { }
