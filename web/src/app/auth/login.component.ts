/**
 * 管理者認証ページコンポーネント。
 * @module app/auth/login.component
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppError } from '../core/app-error';
import { AuthInfo } from '../shared/common.model';
import { AuthService } from './auth.service';

/**
 * 管理者認証ページコンポーネントクラス。
 */
@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
	providers: [
		AuthService,
	],
})
export class LoginComponent implements OnInit {
	/** 初期化処理済か？ */
	initialized = false;
	/** 認証情報 */
	user = { name: '', password: '' };
	/** エラーメッセージ */
	error = '';
	/** 画面ロック中か？ */
	isLocked = false;

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
		// 認証可能な状態でアクセスされた場合は画面遷移
		const authed = await this.authService.checkSession();
		if (authed) {
			await this.forwardAuthedPage(authed);
		}
		this.initialized = true;
	}

	/**
	 * 管理者認証を行う。
	 * @returns 処理状態。
	 */
	async submit(): Promise<void> {
		// 認証を行う。認証OKの場合画面遷移する
		this.isLocked = true;
		try {
			const authed = await this.login();
			if (authed) {
				await this.forwardAuthedPage(authed);
			}
		} finally {
			this.isLocked = false;
		}
	}

	/**
	 * 管理者を認証する。
	 * @returns 認証成功の場合は認証情報、失敗時はnull。
	 */
	private async login(): Promise<AuthInfo> {
		this.error = '';
		try {
			return await this.authService.login(this.user.name, this.user.password);
		} catch (e) {
			if (!(e instanceof AppError) || e.status !== 400) {
				throw e;
			}
			this.error = 'LOGIN_PAGE.FAILED';
			return null;
		}
	}

	/**
	 * ログイン後の画面に遷移する。
	 * @param auth 認証情報。
	 * @returns 処理状態。
	 */
	private async forwardAuthedPage(auth: AuthInfo): Promise<void> {
		const url = auth.backupUrl || '/';
		auth.backupUrl = null;
		await this.router.navigateByUrl(url);
	}
}
