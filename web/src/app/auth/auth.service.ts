/**
 * 管理者認証関連サービスモジュール。
 * @module app/auth/auth.service
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthInfo } from '../shared/common.model';

/**
 * 管理者認証関連サービスクラス。
 */
@Injectable()
export class AuthService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 * @param authInfo 認証情報。
	 */
	constructor(
		private http: HttpClient,
		private authInfo: AuthInfo) { }

	/**
	 * 管理者としてログインする。
	 * @param username 管理者名。
	 * @param password パスワード。
	 * @returns ログイン成功の場合、認証情報。
	 * @throws ログイン失敗や通信エラーの場合。
	 */
	async login(username: string, password: string): Promise<AuthInfo> {
		const user = await this.http.post('/api/admin/administrators/login', { username, password }).toPromise();
		Object.assign(this.authInfo, this.administratorToAuthInfo(user));
		return this.authInfo;
	}

	/**
	 * ログアウトする。
	 * @returns 処理状態。
	 * @throws 通信エラーの場合。
	 */
	async logout(): Promise<void> {
		await this.http.post('/api/admin/administrators/logout', {}).toPromise();
		this.authInfo.clear();
	}

	/**
	 * 認証情報の復元。
	 * @returns 認証中の場合認証情報、それ以外はnull。
	 */
	async checkSession(): Promise<AuthInfo> {
		// 認証しているかチェックのため自分を読み込み
		try {
			const user = await this.findMe();
			if (user) {
				Object.assign(this.authInfo, user);
			}
			return this.authInfo;
		} catch (e) {
			if (e instanceof HttpErrorResponse && e.status === 401) {
				this.authInfo.clear();
				return null;
			}
			throw e;
		}
	}

	/**
	 * 自分自身の情報を取得する。
	 * @returns 取得結果。
	 * @throws 未認証状態、または通信エラーの場合。
	 */
	async findMe(): Promise<AuthInfo> {
		const user = await this.http.get('/api/admin/administrators/me').toPromise();
		return this.administratorToAuthInfo(user);
	}

	/**
	 * 自分自身のパスワードを変更する。
	 * @param password 新しいパスワード。
	 * @returns 処理状態。
	 */
	async changePassword(password: string): Promise<void> {
		await this.http.put('/api/admin/administrators/me', { password }).toPromise();
	}

	/**
	 * 管理者情報を認証情報に変換する。
	 * @param json 管理者情報のJSON。
	 * @returns 認証情報。
	 */
	private administratorToAuthInfo(json: object): AuthInfo {
		const info = new AuthInfo();
		for (const key of ['id', 'name', 'role']) {
			info[key] = json[key];
		}
		return info;
	}
}
