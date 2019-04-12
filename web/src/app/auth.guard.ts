/**
 * GM Tool認証アクセス制御モジュール。
 * @module ./app/auth.guard
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthInfo } from './shared/common.model';

/**
 * 認証アクセス制御クラス。
 */
@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	/**
	 * サービス等をDIしてコンポーネントを生成する。
	 * @param router ルーター。
	 * @param auth 認証情報。
	 */
	constructor(
		private router: Router,
		private auth: AuthInfo) {
	}

	/**
	 * 認証チェック処理。
	 * @param next 現在のルート情報。
	 * @param state 遷移先のルート情報。
	 * @return チェックOKの場合true。
	 */
	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		// 認証済みならOK
		if (this.auth.isAuthed()) {
			return true;
		}
		// 未認証は遷移先をバックアップしてログイン画面に転送
		this.auth.backupUrl = state.url;
		this.router.navigate(['/login']);
		return false;
	}
}
