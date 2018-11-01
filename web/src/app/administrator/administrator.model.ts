/**
 * 管理者モデルモジュール。
 * @module app/administrator/administrator.model
 */

/**
 * 管理者。
 */
export interface Administrator {
	/** 管理者ID */
	id?: number;
	/** 管理者名 */
	name: string;
	/** ロール */
	role: string;
	/** パスワード */
	password?: string;
	/** 備考 */
	note?: string;
	/** 登録日時 */
	createdAt?: string;
	/** 最終更新日時 */
	updatedAt?: string;
	/** 削除日時 */
	deletedAt?: string;
}
