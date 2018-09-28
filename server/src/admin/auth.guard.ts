/**
 * GMツールAPI用アクセス制限モジュール。
 * @module ./admin/auth.guard
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedError } from '../core/errors';

/**
 * GMツールAPI用アクセス制限クラス。
 */
@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * アクセス可否を判定する。
	 * @param context アクセス情報。
	 * @returns アクセス可の場合true。
	 * @throws UnauthorizedError 未認証の場合。
	 */
	canActivate(context: ExecutionContext): boolean {
		// Nest.jsとpassportの組み合わせがいまいち上手くいかないため、sessionで独自に認証管理。
		// req.userにuser情報をコピーして、コントローラからはpassportのように見えるようにする。
		const req = context.switchToHttp().getRequest();
		req.user = req.session['admin'];

		// TODO: Roleも見れるようにする
		if (!req.user) {
			throw new UnauthorizedError('session is not found');
		}
		return true;
	}
}