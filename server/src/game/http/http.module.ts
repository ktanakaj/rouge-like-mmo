/**
 * HTTP APIルートモジュール。
 * @module ./game/http/http.module
 */
import { Module } from '@nestjs/common';
import { redisRpcClientProvider } from '../../shared/redis-rpc-client.provider';
import { GameService } from '../shared/game.service';
import { MastersController } from './system/masters.controller';
import { EnvController } from './system/env.controller';
import { GameController } from './games/game.controller';
import { PlayersController } from './players/players.controller';
import { PlayerCharactersController } from './players/player-characters.controller';

/**
 * HTTP APIルートモジュールクラス。
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
		redisRpcClientProvider,
		GameService,
	],
})
export class HttpModule { }
