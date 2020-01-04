/**
 * ゲームコントローラモジュール。
 * @module ./game/http/games/game.controller
 */
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiProperty, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { IsInt } from 'class-validator';
import { User } from '../../../core/auth';
import { AuthGuard } from '../auth.guard';
import Dungeon from '../../shared/dungeon.model';
import PlayerCharacter from '../../shared/player-character.model';
import { GameService } from '../../shared/game.service';

class GetStatusResult {
	// TODO: 項目はインゲーム実装に合わせて精査する
	@ApiProperty({ description: 'プレイヤーLV', type: 'integer' })
	playerLevel: number;
	@ApiProperty({ description: 'ダンジョンID（未プレイ時はnull）', type: 'integer' })
	dungeonId: number;
	@ApiProperty({ description: 'フロア番号（〃）', type: 'integer' })
	floorNo: number;
	@ApiProperty({ description: 'フロアサーバーURL' })
	url: string;
}

class StartBody {
	@ApiProperty({ description: 'プレイヤーキャラクターID', type: 'integer' })
	@IsInt()
	pcId: number;
	@ApiProperty({ description: 'ダンジョンID', type: 'integer' })
	@IsInt()
	dungeonId: number;
}

/**
 * ゲームコントローラクラス。
 */
@ApiTags('game')
@ApiSecurity('SessionId')
@UseGuards(AuthGuard)
@Controller('api/game')
export class GameController {
	constructor(private readonly gameService: GameService) { }

	@ApiOperation({ summary: 'ゲーム状態取得', description: '現在のゲーム状態を取得する。' })
	@ApiCreatedResponse({ description: 'ゲーム状態', type: GetStatusResult })
	@Get('/status')
	async getStatus(@User() user, @Request() request): Promise<GetStatusResult> {
		// TODO: プレイ中のゲームの情報を返す
		return {
			playerLevel: user.level,
			dungeonId: null,
			floorNo: null,
			// TODO: 本当は、フロア生成時にDBにフロアを管理するサーバーのURLを保存して、ここではそれを返す
			url: 'ws://' + request.headers.host + '/ws/',
		};
	}

	@ApiOperation({ summary: 'ゲーム開始', description: '新しいゲームを開始する。' })
	@ApiCreatedResponse({ description: 'フロアサーバーURL', type: String })
	@Post('/start')
	async start(@Body() body: StartBody, @User() user, @Request() request): Promise<string> {
		// TODO: ダンジョンの1階を探索して、必要に応じて新規作成
		// TODO: プレイヤーをフロアに配置して、接続情報を返す
		const pc = await PlayerCharacter.findOrFail(user.id, body.pcId);
		const dungeon = await Dungeon.findOrFail(body.dungeonId);
		await this.gameService.requestFloor(user.id, pc.id, dungeon.id);

		// TODO: 本当は、フロア生成時にDBにフロアを管理するサーバーのURLを保存して、ここではそれを返す
		// ※ 以下は、開発用の1台のサーバーでHTTPリクエストも捌く場合のURL。
		//    フロアはサーバーのメモリ上に存在するため、サーバーを増やせるよう、
		//    またフロアを所持するサーバーに繋がるよう、そのサーバーのホスト名とポート
		//    が区別できるURLを返したい。
		return 'ws://' + request.headers.host + '/ws/';
	}
}
