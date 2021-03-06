/**
 * ファイル操作関連ユーティリティモジュール。
 * @module ./core/utils/file-utils
 */
import * as fs from 'fs';
import * as path from 'path';

/**
 * 指定されたディレクトリ下の全ファイルに再帰的に同期で渡された関数をコールする。
 * @param root 実行元パス。
 * @param func 実行する関数。
 */
function directoryWalkRecursiveSync(root: string, func: (path: string) => void): void {
	fs.readdirSync(root).forEach((fname) => {
		const realpath = fs.realpathSync(path.join(root, fname));
		if (fs.statSync(realpath).isDirectory()) {
			directoryWalkRecursiveSync(realpath, func);
		} else {
			func(realpath);
		}
	});
}

/**
 * 指定されたディレクトリ下の全ファイルに同期で渡された関数をコールする。
 * @param root 実行元パス。
 * @param func 実行する関数。
 */
function directoryWalkSync(root: string, func: (path: string) => void): void {
	fs.readdirSync(root).forEach((fname) => {
		const realpath = fs.realpathSync(path.join(root, fname));
		if (!fs.statSync(realpath).isDirectory()) {
			func(realpath);
		}
	});
}

/**
 * 指定されたディレクトリ下の全ファイルを再帰的にrequireする。
 * @param root 実行元パス。
 * @returns pathをキー、require結果を値とするオブジェクト。
 */
function requireDirectoriesRecursiveSync(root: string): object {
	const map = {};
	directoryWalkRecursiveSync(root, (p) => {
		if (/\.[jt]s$/.test(p) && !/\.d.ts$/.test(p)) {
			map[p] = require(p);
		}
	});
	return map;
}

/**
 * 指定されたディレクトリ下の全ファイルをrequireする。
 * @param root 実行元パス。
 * @returns pathをキー、require結果を値とするオブジェクト。
 */
function requireDirectoriesSync(root: string): object {
	const map = {};
	directoryWalkSync(root, (p) => {
		if (/\.[jt]s$/.test(p) && !/\.d.ts$/.test(p)) {
			map[p] = require(p);
		}
	});
	return map;
}

export default {
	directoryWalkRecursiveSync,
	directoryWalkSync,
	requireDirectoriesRecursiveSync,
	requireDirectoriesSync,
};
