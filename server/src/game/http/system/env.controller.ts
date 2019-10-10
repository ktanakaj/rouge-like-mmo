/**
 * 環境情報コントローラモジュール。
 * @module ./game/http/system/env.controller
 */
import { Controller, Get } from '@nestjs/common';
import { ApiUseTags, ApiModelProperty, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import * as path from 'path';
import AppVersion from './app-version.model';
const packagejson = require(path.resolve('./package.json'));

class EnvResult {
	@ApiModelProperty({ description: 'サーバーバージョン' })
	serverVersion: string;
	@ApiModelProperty({ description: 'サーバー時間 (UNIXTIME)' })
	serverTime: number;
	@ApiModelProperty({ description: '最低アプリバージョン' })
	minimumAppVersion: string;
	// TODO: メンテナンス予定などもここに入れる
}

/**
 * 環境情報コントローラクラス。
 */
@ApiUseTags('env')
@Controller('api/env')
export class EnvController {
	@ApiOperation({ title: '環境情報', description: '環境情報を取得する。' })
	@ApiOkResponse({ description: '環境情報', type: EnvResult })
	@Get()
	async getEnv(): Promise<EnvResult> {
		// アプリバージョン設定を取得する
		const appVersions = await AppVersion.findAllWithIsActive({ order: ['version'] });
		return {
			serverVersion: packagejson.version,
			serverTime: Math.floor(Date.now() / 1000),
			minimumAppVersion: appVersions.length > 0 ? appVersions[0].version : null,
		};
	}
}
