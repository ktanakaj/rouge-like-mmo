/**
 * GMツールAPI用アクセス制限モジュール。
 * @module ./admin/auth.guard
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UnauthorizedError, ForbiddenError } from '../core/errors';

/**
 * GMツールAPI用アクセス制限クラス。
 */
@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * リフレクターをDIしてガードを生成する。
	 * @param reflector リフレクター。
	 */
	constructor(private readonly reflector: Reflector) { }

	/**
	 * アクセス可否を判定する。
	 * @param context アクセス情報。
	 * @returns アクセス可の場合true。
	 * @throws UnauthorizedError 未ログインの場合。
	 * @throws ForbiddenError 権限が無い場合。
	 */
	canActivate(context: ExecutionContext): boolean {
		// Nest.jsとpassportの組み合わせがいまいち上手くいかないため、sessionで独自に認証管理。
		// req.userにuser情報をコピーして、コントローラからはpassportのように見えるようにする。
		const req = context.switchToHttp().getRequest();
		req.user = req.session['admin'];

		// 未認証
		if (!req.user) {
			throw new UnauthorizedError('Session not found');
		}

		// ロールが指定されている場合はロールも見る
		const roles = this.reflector.get<string[]>('roles', context.getHandler());
		if (!roles) {
			return true;
		}
		if (roles.includes(req.user.role)) {
			return true;
		}

		throw new ForbiddenError(`role=${req.user.role} is not permited`);
	}
}