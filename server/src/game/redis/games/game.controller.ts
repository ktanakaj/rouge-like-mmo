/**
 * ゲームロジック用コントローラモジュール。
 * @module ./game/redis/games/game.controller
 */
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IsInt } from 'class-validator';
import { OnlyFirst, RedisRpcConnection } from '../../../core/redis';
import { AllExceptionsFilter } from '../../../core/filters/all-exceptions.filter';
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

	/**
	 * フロア要求を受けて、フロアを生成する。
	 * @param params フロア要求。
	 * @param conn Redis RPC接続。
	 * @param id リクエストID。
	 */
	@MessagePattern('/redis/create')
	@OnlyFirst
	async create(params: CreateBody, conn: RedisRpcConnection, id: string): Promise<Floor> {
		// フロアを作成し、そこにPCを入室させる。
		const floor = await this.gameService.createFloor(params.dungeonId);
		await this.gameService.joinFloor(floor, params.playerId, params.pcId);
		return floor;
	}
}
