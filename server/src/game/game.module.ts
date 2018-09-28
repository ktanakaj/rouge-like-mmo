/**
 * ゲーム用APIルートモジュール。
 * @module ./game/game.module
 */
import { Module } from '@nestjs/common';
import { GachasController } from './gachas/gachas.controller';

/**
 * ゲーム用APIルートモジュールクラス。
 */
@Module({
	controllers: [GachasController],
})
export class GameModule { }
