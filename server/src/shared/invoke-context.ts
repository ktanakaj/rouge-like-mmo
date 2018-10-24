/**
 * 実行コンテキストモジュール。
 *
 * 実行（主にリクエスト）に対して一意で、どこからも参照可能なデータ領域、
 * （JavaのThreadLocal変数的な仕組み）
 * を意図しているが、現状はただのグローバル変数です。
 * （zone.jsやcls-hookedで実装を試みたが、高負荷時など問題が発生したため未完）
 * @module ./shared/invoke-context
 */
import MasterVersion from './master-version.model';

let forcedMasterVersion;

/**
 * 実行時に参照するマスタバージョンを取得する。
 * @returns マスタバージョンID。有効なバージョンが無い場合nullを返す。
 */
function getMasterVersion(): number {
	return forcedMasterVersion !== undefined ? forcedMasterVersion : null;
}

/**
 * 実行時に参照するマスタバージョンを設定する。
 * @param id マスタバージョンID。
 */
function setMasterVersion(id: number): void {
	forcedMasterVersion = id;
}

/**
 * 実行時に参照するマスタバージョンとして、最新の公開中マスタを設定する。
 * @returns 処理状態。
 */
async function setLatestMasterVersion(): Promise<void> {
	const version = await MasterVersion.findLatest();
	setMasterVersion(version ? version.id : null);
}

export default {
	getMasterVersion,
	setMasterVersion,
	setLatestMasterVersion,
};
