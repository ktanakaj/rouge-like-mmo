/**
 * パスワード変更コンポーネント。
 * @module app/auth/password.component
 */
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * パスワード変更コンポーネントクラス。
 */
@Component({
	templateUrl: './password.component.html',
	styleUrls: ['./password.component.css'],
	providers: [
		AuthService,
	],
})
export class PasswordComponent {
	/** パスワード情報 */
	user = { password: '', repeatPassword: '' };
	/** 画面ロック中か？ */
	isLocked = false;
	/** エラーメッセージ */
	error = '';

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
	 * パスワードを変更する。
	 * @returns 処理状態。
	 */
	async submit(): Promise<void> {
		this.isLocked = true;
		this.error = '';
		try {
			// このタイミングでパスワード一致チェック実施
			if (this.user.password !== this.user.repeatPassword) {
				this.error = 'PASSWORD_CHANGE_PAGE.NOT_SAME';
				return;
			}

			// 変更成功の場合画面遷移する
			await this.authService.changePassword(this.user.password);
			await this.router.navigate(['/']);
		} finally {
			this.isLocked = false;
		}
	}
}
