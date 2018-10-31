/**
 * マスタコントローラモジュール。
 * @module ./admin/masters/masters.controller
 */
import { Controller, Get, Put, Query, Param, Body, UseGuards } from '@nestjs/common';
import {
	ApiUseTags, ApiOperation, ApiImplicitParam, ApiModelProperty, ApiModelPropertyOptional,
	ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse,
} from '@nestjs/swagger';
import * as _ from 'lodash';
import { IsOptional, IsIn } from 'class-validator';
import { BadRequestError } from '../../core/errors';
import { IdParam, PagingQuery, ErrorResult } from '../../shared/common.dto';
import { MODELS } from '../../shared/database.providers';
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
		return await MasterVersion.findAndCount({ limit: query.max, offset: (query.page - 1) * query.max });
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

	@ApiOperation({ title: 'マスタ一覧取得', description: '最新マスタの一覧を取得する。' })
	@ApiOkResponse({ description: 'マスタ名一覧', type: String, isArray: true })
	@ApiNotFoundResponse({ description: '有効なマスタバージョン無し', type: ErrorResult })
	@Get('/latest')
	async findLatestMasters(): Promise<string[]> {
		// 最新のマスタのテーブル一覧を取得する
		const version = await MasterVersion.findLatest();
		return await version.findTables();
	}

	@ApiOperation({ title: 'マスタ取得', description: '指定されたマスタを取得する。' })
	@ApiImplicitParam({ name: 'name', description: 'マスタ名' })
	@ApiOkResponse({ description: 'マスタ配列', type: Object, isArray: true })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Get('/latest/:name')
	async findLatestMaster(@Param('name') name: string): Promise<any> {
		// 最新のマスタを取得する
		// （本当はバージョン指定もできるようにしたかったが、現状グローバルなstaticプロパティで最新しか取れないので断念）
		const modelname = _.upperFirst(_.camelCase(name));
		const model = MODELS.master.find((m) => m.name === modelname);
		if (model === undefined) {
			throw new BadRequestError(`${modelname} is not found.`);
		}
		return await (model as any).findAll();
	}
}
