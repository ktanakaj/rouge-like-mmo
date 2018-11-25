/**
 * Redis APIルートモジュール。
 * @module ./redis/redis.module
 */
import { Module } from '@nestjs/common';
import { GameController } from './games/game.controller';

/**
 * Redis APIルートモジュールクラス。
 */
@Module({
	controllers: [GameController],
})
export class RedisModule { }
