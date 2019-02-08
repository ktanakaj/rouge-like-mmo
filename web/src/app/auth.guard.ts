/**
 * GM Tool認証アクセス制御モジュール。
 * @module ./app/auth.guard
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth/auth.service';

/**
 * 認証アクセス制御クラス。
 */
@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 * @param authService 認証サービス。
	 */
	constructor(
		private router: Router,
		private authService: AuthService) {
	}

	/**
	 * 認証チェック処理。
	 * @param route 現在のルート情報。
	 * @param state 遷移先のルート情報。
	 * @return チェックOKの場合true。
	 */
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		// 管理者として認証済みならOK
		if (this.authService.user) {
			return true;
		}
		// 未認証は遷移先をバックアップしてログイン画面に転送
		this.authService.backupUrl = state.url;
		this.router.navigate(['/login']);
		return false;
	}
}
