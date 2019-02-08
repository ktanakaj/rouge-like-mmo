/**
 * 管理者認証ページコンポーネント。
 * @module app/auth/login.component
 */
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * 管理者認証ページコンポーネントクラス。
 */
@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	/** 初期化処理済か？ */
	initialized = false;
	/** 認証情報 */
	user = { name: '', password: '' };
	/** エラーメッセージ */
	error = '';
	/** ダブルクリック抑止 */
	isButtonClicked = false;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
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
		// 認証可能な状態でアクセスされた場合は画面遷移
		const authed = await this.authService.checkSession();
		if (authed) {
			this.forwardAuthedPage();
		}
		this.initialized = true;
	}

	/**
	 * 管理者認証を行う。
	 * @returns 処理状態。
	 */
	async submit(): Promise<void> {
		// 認証を行う。認証OKの場合画面遷移する
		this.isButtonClicked = true;
		this.error = '';
		try {
			await this.authService.login(this.user.name, this.user.password);
			this.forwardAuthedPage();
		} catch (e) {
			if (!(e instanceof HttpErrorResponse) || e.status !== 400) {
				throw e;
			}
			this.error = 'LOGIN_PAGE.FAILED';
		} finally {
			this.isButtonClicked = false;
		}
	}

	/**
	 * ログイン後の画面に遷移する。
	 */
	private forwardAuthedPage(): void {
		const url = this.authService.backupUrl || '/';
		this.authService.backupUrl = null;
		this.router.navigate([url]);
	}
}
