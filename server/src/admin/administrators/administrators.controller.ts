/**
 * 管理者コントローラモジュール。
 * @module ./admin/administrators/administrators.controller
 */
import * as util from 'util';
import { Controller, Get, Post, Put, Delete, Query, Param, Body, Session, UseGuards } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiModelProperty, ApiModelPropertyOptional, ApiOkResponse } from '@nestjs/swagger';
import { IsOptional, MinLength, IsIn } from 'class-validator';
import { BadRequestError } from '../../core/errors';
import { IdParam, PagingQuery } from '../../shared/common.dto';
import { User } from '../../shared/user.decorator';
import { AuthGuard } from '../auth.guard';
import Administrator from '../shared/administrator.model';

class FindAndCountAdministratorsResult {
	@ApiModelProperty({ description: '総件数' })
	count: number;
	@ApiModelProperty({ description: '結果配列', type: Administrator, isArray: true })
	rows: Administrator[];
}

class CreateAdministratorBody {
	@MinLength(1)
	@ApiModelProperty({ description: '管理者名' })
	name: string
	@IsIn(Administrator.ROLES)
	@ApiModelProperty({ description: 'ロール', enum: Administrator.ROLES })
	role: string;
	@IsOptional()
	@ApiModelPropertyOptional({ description: '注釈' })
	note?: string;
}

class UpdateAdministratorBody {
	@IsOptional()
	@MinLength(1)
	@ApiModelPropertyOptional({ description: '管理者名' })
	name?: string
	@IsOptional()
	@IsIn(Administrator.ROLES)
	@ApiModelPropertyOptional({ description: 'ロール', enum: Administrator.ROLES })
	role?: string;
	@IsOptional()
	@ApiModelPropertyOptional({ description: '注釈' })
	note?: string;
}

class LoginBody {
	@MinLength(1)
	@ApiModelProperty({ description: '管理者名' })
	username: string
	@MinLength(1)
	@ApiModelProperty({ description: 'パスワード' })
	password: string;
}

class UpdateMeBody {
	@MinLength(1)
	@ApiModelProperty({ description: 'パスワード' })
	password: string;
}

/**
 * 管理者コントローラクラス。
 */
@ApiUseTags('admin/administrators')
@Controller('api/admin/administrators')
export class AdministratorsController {
	@ApiOperation({ title: '管理者一覧', description: '管理者の一覧を取得する。' })
	@ApiOkResponse({ description: '管理者一覧', type: FindAndCountAdministratorsResult })
	@UseGuards(AuthGuard)
	@Get()
	async findAndCountAdministrators(@Query() query: PagingQuery): Promise<FindAndCountAdministratorsResult> {
		// ※ 削除済みの管理者も返している
		return await Administrator.findAndCount({ limit: query.max, offset: (query.page - 1) * query.max, paranoid: false });
	}

	@ApiOperation({ title: '管理者登録', description: '管理者を新規登録する。' })
	@ApiOkResponse({ description: '登録成功', type: Administrator })
	@UseGuards(AuthGuard)
	@Post()
	async createAdministrator(@Body() body: CreateAdministratorBody): Promise<Administrator> {
		// FIXME: role=admin の管理者のみ実行可
		const password = Administrator.randomPassword();
		const admin = await Administrator.create(Object.assign(body, { password }));
		// ※ 自動生成したパスワードを返す
		// TODO: 本当はメール送信とかにしたい
		return Object.assign(admin.toJSON(), { password });
	}

	@ApiOperation({ title: '管理者更新', description: '管理者を変更する。' })
	@ApiOkResponse({ description: '更新成功', type: Administrator })
	@UseGuards(AuthGuard)
	@Put('/:id(\\d+)')
	async updateAdministrator(@Param() param: IdParam, @Body() body: UpdateAdministratorBody): Promise<Administrator> {
		// FIXME: role=admin の管理者のみ実行可
		const admin = await Administrator.findOrFail(param.id);
		admin.set(body);
		return await admin.save();
	}

	@ApiOperation({ title: '管理者削除', description: '管理者を削除する。' })
	@ApiOkResponse({ description: '削除成功', type: Administrator })
	@UseGuards(AuthGuard)
	@Delete('/:id(\\d+)')
	async deleteAdministrator(@Param() param: IdParam): Promise<Administrator> {
		// FIXME: role=admin の管理者のみ実行可
		let admin = await Administrator.findOrFail(param.id);
		await admin.destroy();
		return admin;
	}

	@ApiOperation({ title: '管理者パスワードリセット', description: '管理者のパスワードをリセットする。' })
	@ApiOkResponse({ description: 'リセット成功', type: Administrator })
	@UseGuards(AuthGuard)
	@Post('/:id(\\d+)/reset')
	async resetPassword(@Param() param: IdParam): Promise<Administrator> {
		// FIXME: role=admin の管理者のみ実行可
		let admin = await Administrator.findOrFail(param.id);
		const password = Administrator.randomPassword();
		admin.password = password;
		admin = await admin.save();
		// ※ 自動生成したパスワードを返す
		// TODO: 本当はメール送信とかにしたい。メール送信にするなら、自分でリセットするAPIに変える
		return Object.assign(admin.toJSON(), { password });
	}

	@ApiOperation({ title: '管理者ログイン', description: '管理者名とパスワードで認証を行う。' })
	@ApiOkResponse({ description: 'ログイン成功', type: Administrator })
	@Post('/login')
	async login(@Body() body: LoginBody, @Session() session): Promise<Administrator> {
		// アカウント名の存在とパスワードの一致をチェック
		const admin = await Administrator.scope('login').findOne({ where: { name: body.username } });
		if (!admin || !admin.comparePassword(body.password)) {
			throw new BadRequestError('username or password is incorecct');
		}
		// パスワードは返さない
		admin.password = undefined;
		session.user = admin;
		return admin;
	}

	@ApiOperation({ title: '管理者ログアウト', description: 'ログアウトする。' })
	@ApiOkResponse({ description: 'ログアウト成功' })
	@UseGuards(AuthGuard)
	@Post('/logout')
	async logout(@Session() session): Promise<void> {
		await util.promisify(session.destroy).bind(session)();
	}

	@ApiOperation({ title: '自分の情報取得', description: 'ログインユーザー自身の情報を取得する。' })
	@ApiOkResponse({ description: '取得成功', type: Administrator })
	@UseGuards(AuthGuard)
	@Get('/me')
	findMe(@User() user): Administrator {
		return user;
	}

	@ApiOperation({ title: '自分の情報更新', description: 'ログインユーザー自身の情報を変更する。' })
	@ApiOkResponse({ description: '更新成功', type: Administrator })
	@UseGuards(AuthGuard)
	@Put('/me')
	async updateMe(@Body() body: UpdateMeBody, @User() user): Promise<Administrator> {
		// FIXME: role=admin の管理者のみ実行可
		let admin = await Administrator.findOrFail(user.id);
		admin.set(body);
		admin = await admin.save();
		// パスワードは返さない（deleteで何故か消せないのでundefinedで上書き）
		admin.password = undefined;
		return admin;
	}
}
