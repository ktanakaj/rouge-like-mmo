/**
 * 実行コンテキストモジュール。
 *
 * 実行（主にリクエスト）に対して一意で、どこからも参照可能なデータ領域を提供する。
 * （JavaのThreadLocal変数的な仕組みにより、リクエストごとのグローバル変数として機能する。）
 * @module ./shared/invoke-context
 */
import { createNamespace, getNamespace, Namespace } from 'cls-hooked';
import MasterVersion from './master-version.model';

const NAMESPACE_NAME = 'invokeContext';

let mock;
let forcedMasterVersion;

/**
 * 実行コンテキストの中で処理を実行する。
 * ※ 本モジュールの処理はrunのcallback内でしか使用できないので注意。
 * @param callback 実行する処理。
 */
function run(callback: Function): void {
	const session = createNamespace(NAMESPACE_NAME);
	session.run(() => callback());
}

/**
 * 現在の実行コンテキストのデータ領域を取得する。
 * @returns データ領域。
 * @throws Error コンテキストが開始されていない場合。
 */
function getCurrent(): Namespace {
	if (mock) {
		return mock;
	}
	const session = getNamespace(NAMESPACE_NAME);
	if (!session) {
		throw new Error('No context available. run() must be called first.');
	}
	return session;
}

/**
 * モックを有効にする。
 * ※ ユニットテスト用。
 */
function useMock(): void {
	mock = new Map();
}

/**
 * 実行日時を取得する。
 * ※ 単純に new Date() 等で現在日時を取ってしまうと、処理中に日にちを跨いで
 *    有効期間が切れるなどの可能性があるので、こちらを用いることを推奨。
 * @returns 実行日時。未指定の場合現在日時。
 * @throws Error コンテキストが開始されていない場合。
 */
function getDate(): Date {
	return getCurrent().get('date') || new Date();
}

/**
 * 実行日時として現在日時を設定する。
 * @throws Error コンテキストが開始されていない場合。
 */
function setDate(): void {
	getCurrent().set('date', new Date());
}

/**
 * 実行時に参照するマスタバージョンを取得する。
 * ※ 最新のマスタが更新されても、処理中に参照するマスタが変化しないよう、
 *    ここからバージョンを取得する。
 * @returns マスタバージョンID。有効なバージョンが無い場合nullを返す。
 * @throws Error コンテキストが開始されていない場合。
 */
function getMasterVersion(): number {
	const id = getCurrent().get('masterVersion');
	if (id === undefined && forcedMasterVersion !== undefined) {
		return forcedMasterVersion;
	}
	return id !== undefined ? id : null;
}

/**
 * 実行時に参照するマスタバージョンを設定する。
 * @param id マスタバージョンID。
 * @throws Error コンテキストが開始されていない場合。
 */
function setMasterVersion(id: number): void {
	getCurrent().set('masterVersion', id);
}

/**
 * 実行時に参照するマスタバージョンとして、最新の公開中マスタを設定する。
 * @returns 処理状態。
 */
async function setLatestMasterVersion(): Promise<void> {
	const version = await MasterVersion.findLatest();
	setMasterVersion(version ? version.id : null);
}

/**
 * 実行時に参照するマスタバージョンを強制的に設定する。
 * ※ 一部のバッチ用。Bluebird周りでコンテキストが消滅するケースがあるようなのでその対処。通常のリクエストでは使用不可。
 *    （global変数に入れてしまうので、コンテキスト外にも波及してしまう。）
 * @param id マスタバージョンID。
 * @throws Error コンテキストが開始されていない場合。
 */
function forceSetMasterVersion(id: number): void {
	setMasterVersion(id);
	forcedMasterVersion = id;
}

export default {
	run,
	getDate,
	setDate,
	getMasterVersion,
	setMasterVersion,
	setLatestMasterVersion,
	forceSetMasterVersion,
	useMock,
};
