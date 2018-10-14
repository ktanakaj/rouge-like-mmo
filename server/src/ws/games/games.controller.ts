/**
 * ゲームロジック用コントローラモジュール。
 * @module ./ws/games/games.controller
 */
import { Controller, UseFilters, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { WebSocketRpcConnection } from '../../core/ws/ws-rpc-connection';
import { AllExceptionsFilter } from '../../shared/all-exceptions.filter';
import { AuthGuard } from '../auth.guard';

/**
 * ゲームロジック用コントローラクラス。
 */
@UseFilters(AllExceptionsFilter)
@UseGuards(AuthGuard)
@UsePipes(ValidationPipe)
@Controller()
export class GamesController {
	@MessagePattern('/ws/start')
	async start(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: ダンジョンを開始する
	}

	@MessagePattern('/ws/retire')
	async retire(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: ダンジョンをリタイアする
	}

	@MessagePattern('/ws/disconnect')
	async disconnect(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: ゲームを中断する
	}

	@MessagePattern('/ws/getStatus')
	async getStatus(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: 現在のPCの情報を取得する
	}

	@MessagePattern('/ws/getFloor')
	async getFloor(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: 現在いるフロアの情報を取得する
	}

	@MessagePattern('/ws/move')
	async move(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: PCを移動させる
	}

	@MessagePattern('/ws/attack')
	async attack(params: object, conn: WebSocketRpcConnection): Promise<void> {
		// TODO: 敵に攻撃する
	}
}
