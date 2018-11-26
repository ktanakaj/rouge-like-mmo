/**
 * PC操作コントローラモジュール。
 * @module ./game/http/players/player-characters.controller
 */
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import {
	ApiUseTags, ApiOperation, ApiModelProperty, ApiModelPropertyOptional, ApiOkResponse, ApiCreatedResponse,
	ApiBadRequestResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import { IsOptional, MinLength } from 'class-validator';
import { IdParam, ErrorResult } from '../../../shared/common.dto';
import { User } from '../../../shared/user.decorator';
import { AuthGuard } from '../auth.guard';
import PlayerCharacter from '../../shared/player-character.model';

class CreatePcBody {
	@MinLength(1)
	@ApiModelProperty({ description: 'キャラクター名' })
	name: string;
}

class UpdatePcBody {
	@IsOptional()
	@MinLength(1)
	@ApiModelPropertyOptional({ description: 'キャラクター名' })
	name?: string;
}

/**
 * PC操作コントローラクラス。
 */
@UseGuards(AuthGuard)
@ApiUseTags('pc')
@Controller('api/pc')
export class PlayerCharactersController {
	@ApiOperation({ title: 'PC一覧取得', description: 'プレイヤーのPC一覧を取得する。' })
	@ApiOkResponse({ description: 'PC一覧', type: PlayerCharacter, isArray: true })
	@Get()
	async findAll(@User() user): Promise<PlayerCharacter[]> {
		return await PlayerCharacter.findAllByPlayerId(user.id);
	}

	@ApiOperation({ title: 'PC新規登録', description: 'PCを新規登録する。' })
	@ApiCreatedResponse({ description: '登録成功', type: PlayerCharacter })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Post()
	async create(@Body() body: CreatePcBody, @User() user): Promise<PlayerCharacter> {
		// FIXME: HPやアイテム等の扱いについては未定。たぶんマスタから初期値取る？
		return await PlayerCharacter.create(Object.assign(body, { playerId: user.id, hp: 100, items: {} }));
	}

	@ApiOperation({ title: 'PC更新', description: 'PCを変更する。' })
	@ApiOkResponse({ description: '更新成功', type: PlayerCharacter })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@ApiNotFoundResponse({ description: 'データ無し', type: ErrorResult })
	@Put('/:id(\\d+)')
	async update(@Param() param: IdParam, @Body() body: UpdatePcBody, @User() user): Promise<PlayerCharacter> {
		const pc = await PlayerCharacter.findOrFail(user.id, param.id);
		pc.set(body);
		return await pc.save();
	}

	@ApiOperation({ title: 'PC削除', description: 'PCを削除する。' })
	@ApiOkResponse({ description: '削除成功', type: PlayerCharacter })
	@ApiNotFoundResponse({ description: 'データ無し', type: ErrorResult })
	@Delete('/:id(\\d+)')
	async delete(@Param() param: IdParam, @User() user): Promise<PlayerCharacter> {
		const pc = await PlayerCharacter.findOrFail(user.id, param.id);
		await pc.destroy();
		return pc;
	}
}
