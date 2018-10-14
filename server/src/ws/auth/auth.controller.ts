/**
 * WebSocket認証コントローラモジュール。
 * @module ./ws/auth/auth.controller
 */
import { Controller, UseFilters, UseInterceptors, UsePipes, UseGuards, ValidationPipe } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MinLength } from 'class-validator';
import { WebSocketRpcConnection } from '../../core/ws/ws-rpc-connection';
import { AllExceptionsFilter } from '../../shared/all-exceptions.filter';
import User from '../../game/shared/user.model';

class AuthBody {
	@MinLength(1)
	token: string
}

/**
 * WebSocket認証コントローラクラス。
 */
@UseFilters(AllExceptionsFilter)
@UsePipes(ValidationPipe)
@Controller()
export class AuthController {
	@MessagePattern('/ws/auth')
	async auth(params: AuthBody, conn: WebSocketRpcConnection): Promise<{ id: number }> {
		// TODO: トークンが有効かチェックする
		conn.session['id'] = null;
		// TODO: セッションにプレイヤー情報を保存する
		// conn.session['id'] = result.playerId;
		// conn.session['token'] = params.token;
		// // 一応DBにもIDを保存する
		// await User.upsert({ id: result.playerId });
		// return { id: result.playerId };
		return null;
	}
}
