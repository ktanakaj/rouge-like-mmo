/**
 * GMツールAPI用アクセス制限モジュール。
 * @module ./admin/auth.guard
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

/**
 * GMツールAPI用アクセス制限クラス。
 */
@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * アクセス可否を判定する。
	 * @param context アクセス情報。
	 * @returns アクセス可の場合true。
	 */
	canActivate(context: ExecutionContext): boolean {
		// Nest.jsとpassportの組み合わせがいまいち上手くいかないため、sessionで独自に認証管理。
		// req.userにuser情報をコピーして、コントローラからはpassportのように見えるようにする。
		const req = context.switchToHttp().getRequest();
		req.user = req.session.user;

		// TODO: Roleも見れるようにする
		if (!req.user) {
			return false;
		}
		return true;
	}
}