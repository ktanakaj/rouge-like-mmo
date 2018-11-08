/**
 * ゲームコントローラモジュール。
 * @module ./game/games/game.controller
 */
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiModelProperty, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { User } from '../../shared/user.decorator';
import { AuthGuard } from '../auth.guard';
import Dungeon from '../shared/dungeon.model';
import PlayerCharacter from '../shared/player-character.model';

class GetStatusResult {
	// TODO: 項目はインゲーム実装に合わせて精査する
	@ApiModelProperty({ description: 'プレイヤーLV', type: 'integer' })
	playerLevel: number;
	@ApiModelProperty({ description: 'ダンジョンID（未プレイ時はnull）', type: 'integer' })
	dungeonId: number;
	@ApiModelProperty({ description: 'フロア番号（〃）', type: 'integer' })
	floorNo: number;
	@ApiModelProperty({ description: 'サーバーアドレス（〃）' })
	server: string;
}

class StartBody {
	@ApiModelProperty({ description: 'プレイヤーキャラクターID', type: 'integer' })
	@IsInt()
	pcId: number;
	@ApiModelProperty({ description: 'ダンジョンID', type: 'integer' })
	@IsInt()
	dungeonId: number;
}

class StartResult {
	@ApiModelProperty({ description: 'サーバーアドレス' })
	server: string;
}

/**
 * ゲームコントローラクラス。
 */
@UseGuards(AuthGuard)
@ApiUseTags('game')
@Controller('api/game')
export class GameController {
	@ApiOperation({ title: 'ゲーム状態取得', description: '現在のゲーム状態を取得する。' })
	@ApiCreatedResponse({ description: 'ゲーム状態', type: GetStatusResult })
	@Get('/status')
	async getStatus(@User() user): Promise<GetStatusResult> {
		// TODO: プレイ中のゲームの情報を返す
		return {
			playerLevel: user.level,
			dungeonId: null,
			floorNo: null,
			server: 'FIXME',
		};
	}

	@ApiOperation({ title: 'ゲーム開始', description: '新しいゲームを開始する。' })
	@ApiCreatedResponse({ description: 'ゲーム情報', type: StartResult })
	@Post('/start')
	async start(@Body() body: StartBody, @User() user): Promise<StartResult> {
		// TODO: ダンジョンの1階を探索して、必要に応じて新規作成
		// TODO: プレイヤーをフロアに配置して、接続情報を返す
		const pc = await PlayerCharacter.findOrFailByIdAndPlayerId(body.pcId, user.id);
		const dungeon = await Dungeon.findOrFail(body.dungeonId);
		return {
			server: 'FIXME',
		};
	}
}
