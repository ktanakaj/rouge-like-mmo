/**
 * マスタバージョンモデルモジュール。
 * @module app/master/master-version.model
 */

/**
 * マスタバージョン。
 */
export interface MasterVersion {
	/** マスタバージョンID */
	id: number;
	/** 状態 */
	status: string;
	/** 注記 */
	note: string;
	/** 登録日時 */
	createdAt: string;
	/** 最終更新日時 */
	updatedAt: string;
}
