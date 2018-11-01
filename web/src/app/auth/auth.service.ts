/**
 * 管理者認証関連サービスモジュール。
 * @module app/auth/auth.service
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Administrator } from '../administrator/administrator.model';

/**
 * 管理者認証関連サービスクラス。
 */
@Injectable({
	providedIn: 'root'
})
export class AuthService {
	/** 認証中の自分自身の情報 */
	user: Administrator;
	/** 認証後の遷移先URL。 */
	backupUrl: string;

	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: HttpClient) { }

	/**
	 * 管理者としてログインする。
	 * @param username 管理者名。
	 * @param password パスワード。
	 * @returns ログイン成功の場合、管理者情報。
	 * @throws ログイン失敗や通信エラーの場合。
	 */
	async login(username: string, password: string): Promise<Administrator> {
		const admin = await this.http.post<Administrator>('/api/admin/administrators/login', { username, password }).toPromise();
		this.user = admin;
		return admin;
	}

	/**
	 * ログアウトする。
	 * @returns 処理状態。
	 * @throws 通信エラーの場合。
	 */
	async logout(): Promise<void> {
		await this.http.post('/api/admin/administrators/logout', {}).toPromise();
		this.user = null;
	}

	/**
	 * 認証情報の復元。
	 * @returns 認証中の場合true、それ以外はfalse。
	 */
	async checkSession(): Promise<boolean> {
		// 認証しているかチェックのため自分を読み込み
		try {
			this.user = await this.findMe();
			return true;
		} catch (e) {
			if (e instanceof HttpErrorResponse && e.status === 401) {
				return false;
			}
			throw e;
		}
	}

	/**
	 * 自分自身の情報を取得する。
	 * @returns 検索結果。
	 * @throws 未認証状態、または通信エラーの場合。
	 */
	findMe(): Promise<Administrator> {
		return this.http.get<Administrator>('/api/admin/administrators/me').toPromise();
	}

	/**
	 * 自分自身のパスワードを変更する。
	 * @param password 新しいパスワード。
	 * @returns 更新した管理者情報。
	 */
	changePassword(password: string): Promise<Administrator> {
		return this.http.put<Administrator>('/api/admin/administrators/me', { password }).toPromise();
	}
}
