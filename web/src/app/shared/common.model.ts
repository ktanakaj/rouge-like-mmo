/**
 * アプリ共通のモデル定義モジュール。
 * @module app/shared/common.model
 */

/**
 * 認証情報。
 */
export class AuthInfo {
	/** ID */
	id: number;
	/** アカウント名 */
	name: string;
	/** 権限 */
	role: string;
	/** 認証後に遷移するURL */
	backupUrl: string;

	/**
	 * 認証中か？
	 * @returns 認証中の場合true。
	 */
	isAuthed(): boolean {
		return Boolean(this.id);
	}

	/**
	 * 認証情報をクリアする。
	 */
	clear(): void {
		this.id = null;
		this.name = '';
		this.role = null;
		this.backupUrl = null;
	}
}
