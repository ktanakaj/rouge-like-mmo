/**
 * Redis APIルートモジュール。
 * @module ./game/redis/redis.module
 */
import { Module } from '@nestjs/common';
import { GameService } from '../shared/game.service';
import { GameController } from './games/game.controller';

/**
 * Redis APIルートモジュールクラス。
 */
@Module({
	controllers: [GameController],
	providers: [GameService],
})
export class RedisModule { }
