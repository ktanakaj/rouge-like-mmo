/**
 * 拡張Tableデコレーターモジュール。
 * @module ./core/db/shardable/table.decorator
 */
import 'reflect-metadata';
import { Table as SequelizeTable, TableOptions } from 'sequelize-typescript';

/** DB情報用のキー */
export const DB_KEY = Symbol('db');

/**
 * 拡張Tableクラスデコレーター。
 * 標準のTableデコレーターに、DBの設定を追加している。
 * @param options テーブル定義。
 * @returns デコレーターファクトリー。
 */
export function Table(options: TableOptions & { db: string }): Function {
	return (target: any) => {
		Reflect.defineMetadata(DB_KEY, options.db, target);
		(SequelizeTable(options) as any)(target);
	};
}
