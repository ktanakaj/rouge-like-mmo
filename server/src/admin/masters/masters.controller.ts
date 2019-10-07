/**
 * マスタコントローラモジュール。
 * @module ./admin/masters/masters.controller
 */
import { Controller, Get, Put, Query, Param, Body, UseGuards } from '@nestjs/common';
import {
	ApiUseTags, ApiOperation, ApiModelProperty, ApiModelPropertyOptional,
	ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import * as _ from 'lodash';
import { IsOptional, IsIn } from 'class-validator';
import { IdParam, PagingQuery, ErrorResult } from '../../shared/common.dto';
import MasterVersion from '../../shared/master-version.model';
import { Roles } from '../shared/roles.decorator';
import { AuthGuard } from '../auth.guard';

class FindAndCountVersionsResult {
	@ApiModelProperty({ description: '総件数' })
	count: number;
	@ApiModelProperty({ description: '結果配列', type: MasterVersion, isArray: true })
	rows: MasterVersion[];
}

class UpdateVersionBody {
	@IsOptional()
	@IsIn(MasterVersion.STATUSES)
	@ApiModelPropertyOptional({ description: '状態', enum: MasterVersion.STATUSES })
	status?: string;
	@IsOptional()
	@ApiModelPropertyOptional({ description: '注記' })
	note?: string;
}

/**
 * マスタコントローラクラス。
 */
@ApiUseTags('admin/masters')
@UseGuards(AuthGuard)
@Controller('api/admin/masters')
export class MastersController {
	@ApiOperation({ title: 'マスタバージョン一覧', description: 'マスタバージョンの一覧を取得する。' })
	@ApiOkResponse({ description: 'マスタバージョン一覧', type: FindAndCountVersionsResult })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Get()
	async findAndCountVersions(@Query() query: PagingQuery): Promise<FindAndCountVersionsResult> {
		return await MasterVersion.findAndCountAll({ limit: query.max, offset: (query.page - 1) * query.max });
	}

	@Roles('admin', 'writable')
	@ApiOperation({ title: 'マスタバージョン更新', description: 'マスタバージョンを変更する。' })
	@ApiOkResponse({ description: '更新成功', type: MasterVersion })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@ApiNotFoundResponse({ description: 'マスタバージョン無し', type: ErrorResult })
	@Put('/:id(\\d+)')
	async updateVersion(@Param() param: IdParam, @Body() body: UpdateVersionBody): Promise<MasterVersion> {
		const version = await MasterVersion.findOrFail(param.id);
		version.set(body);
		return await version.save();
	}
}
