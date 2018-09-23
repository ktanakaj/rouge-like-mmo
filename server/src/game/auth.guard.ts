/**
 * ゲームAPI用アクセス制限モジュール。
 * @module ./game/auth.guard
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import User from './shared/user.model';

/**
 * ゲームAPI用アクセス制限クラス。
 */
@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * アクセス可否を判定する。
	 * @param context アクセス情報。
	 * @returns アクセス可の場合true。
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// このアプリは未認証でもアクセス可能だが、
		// 内部的には自動的にユーザーを登録する
		const req = context.switchToHttp().getRequest();
		if (!req.session['user']) {
			// TODO: ユーザーIDはランダムに採番するようにする？
			const user = await User.create();
			req.session['user'] = user.toJSON();
		}

		// passport未使用だが、同じプロパティでアクセスできるようにする
		req.user = req.session['user'];
		return true;
	}
}