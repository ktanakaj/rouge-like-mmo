/**
 * モデル用カスタムデコレーターモジュール。
 * @module ./core/models/decorators
 */
import 'reflect-metadata';
import { Table as SequelizeTable } from 'sequelize-typescript';
import { IDefineOptions } from 'sequelize-typescript/lib/interfaces/IDefineOptions';

/** DB情報用のキー */
export const DB_KEY = Symbol('db');

/**
 * 拡張Tableデコレーター。
 * 標準のTableデコレーターに、DBの設定を追加している。
 * @param options テーブル定義。
 * @returns デコレーターファクトリー。
 */
export function Table(options: IDefineOptions & { db: string }): Function {
	return (target: any) => {
		Reflect.defineMetadata(DB_KEY, options.db, target);
		(SequelizeTable(options) as any)(target);
	};
};
