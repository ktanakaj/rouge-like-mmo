/**
 * ガチャコントローラモジュール。
 * @module ./game/gachas/gachas.controller
 */
import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiModelProperty, ApiModelPropertyOptional, ApiCreatedResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { IdParam, ErrorResult } from '../../shared/common.dto';
import { AuthGuard } from '../auth.guard';

/**
 * ガチャコントローラクラス。
 */
@ApiUseTags('gachas')
@Controller('api/gachas')
export class GachasController {
	@ApiOperation({ title: 'ガチャ実行', description: 'ガチャを実行する。' })
	@ApiCreatedResponse({ description: 'ガチャ実行', type: Object })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@UseGuards(AuthGuard)
	@Post('/:id(\\d+)')
	async execute(@Param() param: IdParam): Promise<Object> {
		// TODO: 未実装
		return {};
	}
}
