/**
 * プレイヤーコントローラモジュール。
 * @module ./game/ws/players/players.controller
 */
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { IsInt, MinLength } from 'class-validator';
import { BadRequestError } from '../../../core/errors';
import { WebSocketRpcConnection } from '../../../core/ws';
import { AllExceptionsFilter } from '../../../shared/all-exceptions.filter';
import Player from '../../../game/shared/player.model';

class LoginBody {
	@IsInt()
	id: number;
	@MinLength(1)
	token: string;
}

/**
 * プレイヤーコントローラクラス。
 */
@UseFilters(AllExceptionsFilter)
@UsePipes(ValidationPipe)
@Controller()
export class PlayersController {
	@MessagePattern('/ws/login')
	async login(params: LoginBody, conn: WebSocketRpcConnection): Promise<Player> {
		// プレイヤーIDと端末トークンでプレイヤー認証
		// （端末トークンは自動生成のパスワードとして扱う）
		const player = await Player.findByPkForAuth(params.id);
		if (!player || !player.compareToken(params.token)) {
			throw new BadRequestError('id or token is incorecct');
		}

		// 最終ログイン時間を更新
		player.lastLogin = new Date();
		await player.save();

		// セッションに保存。トークンは返さない
		player.token = undefined;
		conn.session['id'] = player.id;
		return player;
	}
}
