/**
 * 管理者認証ログアウトコンポーネント。
 * @module app/auth/logout.component
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * 管理者認証ログアウトコンポーネントクラス。
 */
@Component({
	template: '',
	providers: [
		AuthService,
	],
})
export class LogoutComponent implements OnInit {
	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param router ルーター。
	 * @param authService 管理者認証関連サービス。
	 */
	constructor(
		private router: Router,
		private authService: AuthService) {
	}

	/**
	 * コンポーネント起動時の処理。
	 * @returns 処理状態。
	 */
	async ngOnInit(): Promise<void> {
		await this.authService.logout();
		await this.router.navigate(['/']);
	}
}
