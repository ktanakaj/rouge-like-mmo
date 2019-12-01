/**
 * プレイヤーコントローラモジュール。
 * @module ./game/http/players/players.controller
 */
import { Controller, Post, Body, Session, HttpCode } from '@nestjs/common';
import { ApiTags, ApiProperty, ApiOperation, ApiOkResponse, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { IsInt, MinLength } from 'class-validator';
import { BadRequestError } from '../../../core/errors';
import { ErrorResult } from '../../../shared/common.dto';
import Player from '../../shared/player.model';

class CreatePlayerBody {
	@ApiProperty({ description: '端末トークン' })
	@MinLength(1)
	token: string;
}

class LoginBody {
	@ApiProperty({ description: 'プレイヤーID' })
	@IsInt()
	id: number;
	@ApiProperty({ description: '端末トークン' })
	@MinLength(1)
	token: string;
}

/**
 * プレイヤーコントローラクラス。
 */
@ApiTags('players')
@Controller('api/players')
export class PlayersController {
	@ApiOperation({ summary: 'プレイヤー登録', description: 'プレイヤーを新規登録する。' })
	@ApiCreatedResponse({ description: '登録成功', type: Player })
	@Post()
	async create(@Body() body: CreatePlayerBody, @Session() session): Promise<Player> {
		// 端末ごとにトークン（クライアント側で自動生成）を貰ってプレイヤー登録
		const player = await Player.create(Object.assign(body, { lastLogin: new Date() }));
		// セッションに保存。トークンは返さない
		player.token = undefined;
		session['user'] = player.toJSON();
		return player;
	}

	@ApiOperation({ summary: 'プレイヤー認証', description: 'プレイヤーを認証する。' })
	@ApiOkResponse({ description: 'ログイン成功', type: Player })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Post('/login')
	@HttpCode(200)
	async login(@Body() body: LoginBody, @Session() session): Promise<Player> {
		// プレイヤーIDと端末トークンでプレイヤー認証
		// （端末トークンは自動生成のパスワードとして扱う）
		const player = await Player.findByPkForAuth(body.id);
		if (!player || !player.compareToken(body.token)) {
			throw new BadRequestError('id or token is incorecct');
		}

		// 最終ログイン時間を更新
		player.lastLogin = new Date();
		await player.save();

		// セッションに保存。トークンは返さない
		player.token = undefined;
		session['user'] = player.toJSON();
		return player;
	}
}
