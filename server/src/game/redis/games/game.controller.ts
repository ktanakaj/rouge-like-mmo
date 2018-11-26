/**
 * ゲームロジック用コントローラモジュール。
 * @module ./game/redis/games/game.controller
 */
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IsInt } from 'class-validator';
import { OnlyFirst, RedisRpcConnection } from '../../../core/redis';
import { AllExceptionsFilter } from '../../../shared/all-exceptions.filter';
import Floor from '../../shared/floor.model';
import { GameService } from '../../shared/game.service';

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
	constructor(private readonly gameService: GameService) { }

	@MessagePattern('/redis/create')
	@OnlyFirst
	async create(params: CreateBody, conn: RedisRpcConnection, id: string): Promise<Floor> {
		const floor = await this.gameService.createFloor(params.dungeonId);
		await this.gameService.joinFloor(floor, params.playerId, params.pcId);
		return floor;
	}
}
