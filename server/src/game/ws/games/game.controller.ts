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
import { floorManager } from '../../shared/floor-manager';

interface GetStatusResult {
	floorId: number;
}

interface GetFloorResult {
	dungeonId: number;
	no: number;
	map: string;
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

	/**
	 * プレイヤーが現在居るフロアの情報を取得する。
	 * @param params リクエスト情報。
	 * @param conn 接続情報。
	 */
	@MessagePattern('/ws/getFloor')
	async getFloor(params: object, conn: WebSocketRpcConnection): Promise<GetFloorResult> {
		// TODO: 現在いるフロアの情報（全員が見えるもの）を取得する
		// FIXME: エラー処理がない
		const floorId = floorManager.floorIdByPlayerId.get(conn.session['id']);
		return floorManager.floors.get(floorId);
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
