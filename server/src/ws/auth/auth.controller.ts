/**
 * WebSocket認証コントローラモジュール。
 * @module ./ws/auth/auth.controller
 */
import { Controller, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MinLength } from 'class-validator';
import { BadRequestError } from '../../core/errors';
import { WebSocketRpcConnection } from '../../core/ws/ws-rpc-connection';
import { AllExceptionsFilter } from '../../shared/all-exceptions.filter';
import Player from '../../game/shared/player.model';

class AuthBody {
	@MinLength(1)
	token: string;
}

/**
 * WebSocket認証コントローラクラス。
 */
@UseFilters(AllExceptionsFilter)
@UsePipes(ValidationPipe)
@Controller()
export class AuthController {
	@MessagePattern('/ws/auth')
	async auth(params: AuthBody, conn: WebSocketRpcConnection): Promise<void> {
		// 端末トークンで認証する
		const player = await Player.findOne({ where: params });
		if (!player) {
			throw new BadRequestError(`token='${params.token}' is not valid`);
		}
		// セッションにプレイヤー情報を保存する
		conn.session['id'] = player.id;
	}
}
