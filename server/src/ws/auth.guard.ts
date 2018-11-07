/**
 * WebSocket API用アクセス制限モジュール。
 * @module ./ws/auth.guard
 */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { UnauthorizedError } from '../core/errors';

/**
 * WebSocket API用アクセス制限クラス。
 */
@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * アクセス可否を判定する。
	 * @param context アクセス情報。
	 * @returns アクセス可の場合true。
	 * @throws UnauthorizedError アクセス不可の場合。
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		// loginでセッションにプレイヤーIDが設定されているかで判定
		const args = context.getArgs();
		if (args[1].session['id']) {
			return true;
		}
		throw new UnauthorizedError('login is not called');
	}
}