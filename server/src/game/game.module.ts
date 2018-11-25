/**
 * ゲーム用APIルートモジュール。
 * @module ./game/game.module
 */
import { Module } from '@nestjs/common';
import * as config from 'config';
import * as log4js from 'log4js';
import { RedisRpcClient } from '../core/redis/redis-rpc-client';
import { GameService } from './games/game.service';
import { MastersController } from './system/masters.controller';
import { EnvController } from './system/env.controller';
import { GameController } from './games/game.controller';
import { PlayersController } from './players/players.controller';
import { PlayerCharactersController } from './players/player-characters.controller';
const redisLogger = log4js.getLogger('redis');

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
	providers: [
		GameService,
		{
			provide: RedisRpcClient,
			useValue: new RedisRpcClient(config['redis']['pubsub'], {
				logger: (level, message) => redisLogger[level](message),
			}),
		},
	],
})
export class GameModule { }
