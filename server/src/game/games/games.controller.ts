/**
 * ゲームコントローラモジュール。
 * @module ./game/games/game.controller
 */
import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiModelProperty, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { User } from '../../shared/user.decorator';
import { AuthGuard } from '../auth.guard';
import Player from '../shared/player.model';

class MakeTokenResult {
	@ApiModelProperty({ description: 'トークン' })
	token: string;
}

/**
 * ゲームコントローラクラス。
 */
@ApiUseTags('games')
@Controller('api/games')
export class GamesController {
	@ApiOperation({ title: 'トークン生成', description: 'WebSocket認証トークンを生成する。' })
	@ApiCreatedResponse({ description: 'トークン', type: MakeTokenResult })
	@UseGuards(AuthGuard)
	@Post('/:id(\\d+)')
	async generateToken(@User() user): Promise<MakeTokenResult> {
		const player = await Player.findOrFail(user['id']);
		player.generateAuthToken();
		await player.save();
		return { token: player.authToken };
	}
}
