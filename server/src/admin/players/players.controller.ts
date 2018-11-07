/**
 * プレイヤーコントローラモジュール。
 * @module ./admin/players/players.controller
 */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiModelProperty, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { PagingQuery, ErrorResult } from '../../shared/common.dto';
import { AuthGuard } from '../auth.guard';
import Player from '../../game/shared/player.model';

class FindAndCountPlayersResult {
	@ApiModelProperty({ description: '総件数' })
	count: number;
	@ApiModelProperty({ description: '結果配列', type: Player, isArray: true })
	rows: Player[];
}

/**
 * プレイヤーコントローラクラス。
 */
@ApiUseTags('admin/players')
@UseGuards(AuthGuard)
@Controller('api/admin/players')
export class PlayersController {
	@ApiOperation({ title: 'プレイヤー一覧', description: 'プレイヤーの一覧を取得する。' })
	@ApiOkResponse({ description: 'プレイヤー一覧', type: FindAndCountPlayersResult })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Get()
	async findAndCountPlayers(@Query() query: PagingQuery): Promise<FindAndCountPlayersResult> {
		return await Player.findAndCount({ limit: query.max, offset: (query.page - 1) * query.max });
	}
}
