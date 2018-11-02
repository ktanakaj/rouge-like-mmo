/**
 * 認証コントローラモジュール。
 * @module ./game/auth/auth.controller
 */
import { Controller, Post, Body, Session, HttpCode } from '@nestjs/common';
import { ApiUseTags, ApiModelProperty, ApiOperation } from '@nestjs/swagger';
import { MinLength } from 'class-validator';
import Player from '../shared/player.model';

class AuthBody {
	@ApiModelProperty({ description: '端末トークン' })
	@MinLength(1)
	token: string;
}

/**
 * 認証コントローラクラス。
 */
@ApiUseTags('auth')
@Controller('api/auth')
export class AuthController {
	@ApiOperation({ title: '端末認証', description: '端末トークンを認証する。' })
	@Post()
	@HttpCode(200)
	async auth(@Body() body: AuthBody, @Session() session): Promise<void> {
		// 端末ごとに一意なトークン（クライアント側で自動生成）を貰ってプレイヤー認証。
		// 存在しない場合は新規プレイヤーとして登録。
		const [player] = await Player.findOrInitialize({ where: { token: body.token } });
		player.lastLogin = new Date();
		await player.save();
		session['user'] = player.toJSON();
	}
}
