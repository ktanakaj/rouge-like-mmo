/**
 * マスタコントローラモジュール。
 * @module ./game/http/system/masters.controller
 */
import { Controller, Get, Param } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiImplicitParam, ApiOkResponse, ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import * as _ from 'lodash';
import { BadRequestError } from '../../../core/errors';
import { ErrorResult } from '../../../shared/common.dto';
import { MODELS } from '../../../shared/database.providers';
import MasterVersion from '../../../shared/master-version.model';

/**
 * マスタコントローラクラス。
 */
@ApiUseTags('masters')
@Controller('api/masters')
export class MastersController {
	@ApiOperation({ title: 'マスタ一覧取得', description: '最新マスタの一覧を取得する。' })
	@ApiOkResponse({ description: 'マスタ名一覧', type: String, isArray: true })
	@ApiNotFoundResponse({ description: '有効なマスタバージョン無し', type: ErrorResult })
	@Get()
	async findLatestMasters(): Promise<string[]> {
		// 最新のマスタのテーブル一覧を取得する
		const version = await MasterVersion.findLatest();
		return await version.findTables();
	}

	@ApiOperation({ title: 'マスタ取得', description: '指定されたマスタを取得する。' })
	@ApiImplicitParam({ name: 'name', description: 'マスタ名' })
	@ApiOkResponse({ description: 'マスタ配列', type: Object, isArray: true })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Get(':name')
	async findLatestMaster(@Param('name') name: string): Promise<any> {
		// 最新のマスタを取得する
		const modelname = _.upperFirst(_.camelCase(name));
		const model = MODELS.master.find((m) => m.name === modelname);
		if (model === undefined) {
			throw new BadRequestError(`${modelname} is not found.`);
		}
		return await (model as any).findAll();
	}
}
