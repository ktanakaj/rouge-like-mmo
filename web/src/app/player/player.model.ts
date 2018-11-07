/**
 * プレイヤーモデルモジュール。
 * @module app/player/player.model
 */

/**
 * プレイヤー。
 */
export interface Player {
	/** プレイヤーID */
	id: number;
	/** プレイヤーレベル */
	level: string;
	/** プレイヤー所持金 */
	gameCoins: string;
	/** 最終ログイン日時 */
	lastLogin: string;
	/** 登録日時 */
	createdAt: string;
	/** 最終更新日時 */
	updatedAt: string;
}
