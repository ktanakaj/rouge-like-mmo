/**
 * プレイヤーコントローラモジュール。
 * @module ./admin/players/players.controller
 */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiSecurity, ApiOperation, ApiProperty, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { PagingQuery, ErrorResult } from '../../shared/common.dto';
import { AuthGuard } from '../auth.guard';
import Player from '../../game/shared/player.model';

class FindAndCountPlayersResult {
	@ApiProperty({ description: '総件数' })
	count: number;
	@ApiProperty({ description: '結果配列', type: Player, isArray: true })
	rows: Player[];
}

/**
 * プレイヤーコントローラクラス。
 */
@ApiTags('admin/players')
@ApiSecurity('SessionId')
@UseGuards(AuthGuard)
@Controller('api/admin/players')
export class PlayersController {
	@ApiOperation({ summary: 'プレイヤー一覧', description: 'プレイヤーの一覧を取得する。' })
	@ApiOkResponse({ description: 'プレイヤー一覧', type: FindAndCountPlayersResult })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Get()
	async findAndCountPlayers(@Query() query: PagingQuery): Promise<FindAndCountPlayersResult> {
		return await Player.findAndCountAll({ limit: query.max, offset: (query.page - 1) * query.max });
	}
}
