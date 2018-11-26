/**
 * ゲーム用APIルートモジュール。
 * @module ./game/game.module
 */
import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { WsModule } from './ws/ws.module';
import { RedisModule } from './redis/redis.module';

/**
 * ゲーム用APIルートモジュールクラス。
 */
@Module({
	imports: [HttpModule, WsModule, RedisModule],
})
export class GameModule { }
