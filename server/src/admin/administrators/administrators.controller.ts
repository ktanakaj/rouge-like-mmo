/**
 * 管理者コントローラモジュール。
 * @module ./admin/administrators/administrators.controller
 */
import { Controller, Get, Post, Put, Delete, Query, Param, Body, Session, UseGuards, HttpCode } from '@nestjs/common';
import {
	ApiTags, ApiSecurity, ApiOperation, ApiProperty, ApiPropertyOptional, ApiOkResponse, ApiCreatedResponse,
	ApiBadRequestResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiConflictResponse,
} from '@nestjs/swagger';
import { IsOptional, MinLength, IsIn } from 'class-validator';
import { BadRequestError } from '../../core/errors';
import { IdParam, PagingQuery, ErrorResult } from '../../shared/common.dto';
import { User } from '../../shared/user.decorator';
import { AuthGuard } from '../auth.guard';
import { Roles } from '../shared/roles.decorator';
import Administrator from '../shared/administrator.model';

class FindAndCountAdministratorsResult {
	@ApiProperty({ description: '総件数' })
	count: number;
	@ApiProperty({ description: '結果配列', type: Administrator, isArray: true })
	rows: Administrator[];
}

class CreateAdministratorBody {
	@MinLength(1)
	@ApiProperty({ description: '管理者名' })
	name: string;
	@IsIn(Administrator.ROLES)
	@ApiProperty({ description: 'ロール', enum: Administrator.ROLES })
	role: string;
	@IsOptional()
	@ApiPropertyOptional({ description: '注釈' })
	note?: string;
}

class UpdateAdministratorBody {
	@IsOptional()
	@MinLength(1)
	@ApiPropertyOptional({ description: '管理者名' })
	name?: string;
	@IsOptional()
	@IsIn(Administrator.ROLES)
	@ApiPropertyOptional({ description: 'ロール', enum: Administrator.ROLES })
	role?: string;
	@IsOptional()
	@ApiPropertyOptional({ description: '注釈' })
	note?: string;
}

class AdminLoginBody {
	@MinLength(1)
	@ApiProperty({ description: '管理者名' })
	username: string;
	@MinLength(1)
	@ApiProperty({ description: 'パスワード' })
	password: string;
}

class UpdateMeBody {
	@MinLength(1)
	@ApiProperty({ description: 'パスワード' })
	password: string;
}

/**
 * 管理者コントローラクラス。
 */
@ApiTags('admin/administrators')
@Controller('api/admin/administrators')
export class AdministratorsController {
	@ApiOperation({ summary: '管理者一覧', description: '管理者の一覧を取得する。' })
	@ApiOkResponse({ description: '管理者一覧', type: FindAndCountAdministratorsResult })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Get()
	async findAndCountAdministrators(@Query() query: PagingQuery): Promise<FindAndCountAdministratorsResult> {
		// ※ 削除済みの管理者も返している
		return await Administrator.findAndCountAll({ limit: query.max, offset: (query.page - 1) * query.max, paranoid: false });
	}

	@ApiOperation({ summary: '管理者登録', description: '管理者を新規登録する。' })
	@ApiCreatedResponse({ description: '登録成功', type: Administrator })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@ApiForbiddenResponse({ description: '権限無し', type: ErrorResult })
	@ApiConflictResponse({ description: 'name重複', type: ErrorResult })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Roles('admin')
	@Post()
	async createAdministrator(@Body() body: CreateAdministratorBody): Promise<Administrator> {
		const password = Administrator.randomPassword();
		const admin = await Administrator.create(Object.assign(body, { password }));
		// ※ 自動生成したパスワードを返す
		// TODO: 本当はメール送信とかにしたい
		return Object.assign(admin.toJSON(), { password }) as Administrator;
	}

	@ApiOperation({ summary: '管理者更新', description: '管理者を変更する。' })
	@ApiOkResponse({ description: '更新成功', type: Administrator })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@ApiForbiddenResponse({ description: '権限無し', type: ErrorResult })
	@ApiNotFoundResponse({ description: 'データ無し', type: ErrorResult })
	@ApiConflictResponse({ description: 'name重複', type: ErrorResult })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Roles('admin')
	@Put('/:id(\\d+)')
	async updateAdministrator(@Param() param: IdParam, @Body() body: UpdateAdministratorBody): Promise<Administrator> {
		const admin = await Administrator.findOrFail(param.id);
		admin.set(body);
		return await admin.save();
	}

	@ApiOperation({ summary: '管理者削除', description: '管理者を削除する。' })
	@ApiOkResponse({ description: '削除成功', type: Administrator })
	@ApiForbiddenResponse({ description: '権限無し', type: ErrorResult })
	@ApiNotFoundResponse({ description: 'データ無し', type: ErrorResult })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Roles('admin')
	@Delete('/:id(\\d+)')
	async deleteAdministrator(@Param() param: IdParam): Promise<Administrator> {
		const admin = await Administrator.findOrFail(param.id);
		await admin.destroy();
		return admin;
	}

	@ApiOperation({ summary: '管理者パスワードリセット', description: '管理者のパスワードをリセットする。' })
	@ApiOkResponse({ description: 'リセット成功', type: Administrator })
	@ApiForbiddenResponse({ description: '権限無し', type: ErrorResult })
	@ApiNotFoundResponse({ description: 'データ無し', type: ErrorResult })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Roles('admin')
	@Post('/:id(\\d+)/reset')
	@HttpCode(200)
	async resetPassword(@Param() param: IdParam): Promise<Administrator> {
		let admin = await Administrator.findOrFail(param.id);
		const password = Administrator.randomPassword();
		admin.password = password;
		admin = await admin.save();
		// ※ 自動生成したパスワードを返す
		// TODO: 本当はメール送信とかにしたい。メール送信にするなら、自分でリセットするAPIに変える
		return Object.assign(admin.toJSON(), { password }) as Administrator;
	}

	@ApiOperation({ summary: '管理者ログイン', description: '管理者名とパスワードで認証を行う。' })
	@ApiOkResponse({ description: 'ログイン成功', type: Administrator })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@Post('/login')
	@HttpCode(200)
	async login(@Body() body: AdminLoginBody, @Session() session): Promise<Administrator> {
		// アカウント名の存在とパスワードの一致をチェック
		const admin = await Administrator.scope('login').findOne({ where: { name: body.username } });
		if (!admin || !admin.comparePassword(body.password)) {
			throw new BadRequestError('username or password is incorecct');
		}
		// パスワードは返さない
		admin.password = undefined;
		session['admin'] = admin.toJSON();
		return admin;
	}

	@ApiOperation({ summary: '管理者ログアウト', description: 'ログアウトする。' })
	@ApiOkResponse({ description: 'ログアウト成功' })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Post('/logout')
	@HttpCode(200)
	logout(@Session() session): void {
		delete session['admin'];
	}

	@ApiOperation({ summary: '自分の情報取得', description: 'ログインユーザー自身の情報を取得する。' })
	@ApiOkResponse({ description: '取得成功', type: Administrator })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Get('/me')
	findMe(@User() user): Administrator {
		return user;
	}

	@ApiOperation({ summary: '自分の情報更新', description: 'ログインユーザー自身の情報を変更する。' })
	@ApiOkResponse({ description: '更新成功', type: Administrator })
	@ApiBadRequestResponse({ description: 'パラメータ不正', type: ErrorResult })
	@ApiSecurity('SessionId')
	@UseGuards(AuthGuard)
	@Put('/me')
	async updateMe(@Body() body: UpdateMeBody, @User() user): Promise<Administrator> {
		let admin = await Administrator.findOrFail(user.id);
		admin.set(body);
		admin = await admin.save();
		// パスワードは返さない（deleteで何故か消せないのでundefinedで上書き）
		admin.password = undefined;
		return admin;
	}
}
