/**
 * ダンジョンフロア管理モジュール。
 * @module ./game/shared/floor.model
 */
import Floor from './floor.model';

/**
 * ダンジョンフロア管理用クラス。
 *
 * WebSocketサーバーのメモリ上で、現在アクティブなフロアとそこに居るプレイヤーを管理する。
 */
export class FloorManager {
	/** 現在有効なフロアのマップ（キーはID） */
	public floors: Map<number, Floor> = new Map<number, Floor>();

	/** プレイヤーが参加中のフロアのマップ */
	public floorIdByPlayerId: Map<number, number> = new Map<number, number>();
}

/**
 * ダンジョンフロア管理用インスタンス。
 *
 * シングルトンでメモリ上で管理する想定。
 */
export const floorManager = new FloorManager();
