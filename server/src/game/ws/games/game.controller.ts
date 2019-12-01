/**
 * ゲームロジック用コントローラモジュール。
 * @module ./game/ws/games/game.controller
 */
import { Controller, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IsInt, Min, Max } from 'class-validator';
import { WebSocketRpcConnection } from '../../../core/ws';
import { AllExceptionsFilter } from '../../../core/filters/all-exceptions.filter';
import { GameService } from '../../shared/game.service';
import { AuthGuard } from '../auth.guard';

class GetStatusResult {
	floorId: number;
}

class GetFloorResult {
}

/**
 * ゲームロジック用コントローラクラス。
 */
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
@Controller()
export class GameController {
	constructor(private readonly gameService: GameService) { }

	@MessagePattern('/ws/activate')
	async activate(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: PCをゲーム内に出現させる、ゲーム開始後やフロア移動時に呼ぶ
	}

	@MessagePattern('/ws/deactivate')
	async deactivate(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: PCをゲーム内から取り除く。ゲームを中断する
	}

	@MessagePattern('/ws/getStatus')
	async getStatus(params: any, conn: WebSocketRpcConnection): Promise<GetStatusResult> {
		// TODO: 現在のPCの情報（他のプレイヤーに見えないもの）を取得する
		return null;
	}

	@MessagePattern('/ws/getFloor')
	async getFloor(params: object, conn: WebSocketRpcConnection): Promise<GetFloorResult> {
		// TODO: 現在いるフロアの情報（全員が見えるもの）を取得する
		return null;
	}

	@MessagePattern('/ws/move')
	async move(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: PCを移動させる
	}

	@MessagePattern('/ws/attack')
	async attack(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: 敵に攻撃する
	}

	@MessagePattern('/ws/retire')
	async retire(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: ダンジョンをリタイアする
	}
}
