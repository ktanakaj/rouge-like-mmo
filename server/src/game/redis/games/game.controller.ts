/**
 * ゲームロジック用コントローラモジュール。
 * @module ./game/redis/games/game.controller
 */
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IsInt } from 'class-validator';
import { AllExceptionsFilter } from '../../../shared/all-exceptions.filter';
import Floor from '../../../game/shared/floor.model';

class CreateBody {
	@IsInt()
	playerId: number;
	@IsInt()
	pcId: number;
	@IsInt()
	dungeonId: number;
}

/**
 * ゲームロジック用コントローラクラス。
 */
@UseFilters(AllExceptionsFilter)
@UsePipes(ValidationPipe)
@Controller()
export class GameController {
	@MessagePattern('/redis/create')
	async create(params: CreateBody): Promise<Floor> {
		// TODO: 未実装
		return null;
	}
}
