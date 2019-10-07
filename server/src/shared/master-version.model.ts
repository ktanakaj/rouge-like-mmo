/**
 * マスタバージョンモデルモジュール。
 * @module ./shared/master-version.model
 */
import { Model, Column, DataType, AllowNull, Default, DefaultScope } from 'sequelize-typescript';
import { FindOptions } from 'sequelize';
import { ApiModelProperty } from '@nestjs/swagger';
import { NotFoundError } from '../core/errors';
import { Table } from '../core/db';

/**
 * マスタバージョンマスタモデルクラス。
 *
 * 通常のマスタとは異なり、マスタのインポート時にアプリが自動生成する特別なマスタ。
 * マスタのバージョンと日付を管理する。
 * ※ 仕組みが異なるため、MasterModelは継承しません。
 */
@DefaultScope({
	// デフォルトではIDの降順でソートされる
	order: [
		['id', 'DESC'],
	],
})
@Table({
	db: 'master',
	tableName: 'masterVersions',
	comment: 'マスタバージョンマスタ',
	timestamps: true,
})
export default class MasterVersion extends Model<MasterVersion> {
	// 複数バージョンのマスタを保持し、かつそのバージョンの有効無効を切り替えられるようにする。

	/** 状態定義 */
	static readonly STATUSES = ['importing', 'readied', 'failed', 'published'];

	/** 状態 */
	@ApiModelProperty({ description: '状態' })
	@AllowNull(false)
	@Default('importing')
	@Column({
		type: DataType.ENUM,
		values: MasterVersion.STATUSES,
	})
	status: string;

	/** 注記 */
	@ApiModelProperty({ description: '注記' })
	@AllowNull(false)
	@Default('')
	@Column
	note: string;

	/**
	 * マスタのテーブル一覧を取得する。
	 * @returns マスタテーブル名の一覧。
	 */
	async findTables(): Promise<string[]> {
		// マスタのテーブル一覧を取得する
		// （本当は現バージョンに存在するものにしたかったが、現状はソース準拠でしか返せない）
		return Object.keys(MasterVersion.sequelize.models).filter((t) => t !== 'MasterVersion');
	}

	/**
	 * マスタバージョンを取得する。
	 * @param id マスタバージョンID。
	 * @param options 検索オプション。
	 * @returns マスタバージョン。
	 * @throws NotFoundError マスタバージョンが存在しない場合。
	 */
	static async findOrFail(id: number, options?: FindOptions): Promise<MasterVersion> {
		const instance = await this.findByPk(id, options);
		if (!instance) {
			throw new NotFoundError(this.name, id);
		}
		return instance;
	}

	/**
	 * 最新の有効なマスタバージョンを取得する。
	 * @returns マスタバージョン。存在しない場合はnull。
	 */
	static async findLatest(): Promise<MasterVersion> {
		return await this.findOne({ where: { status: 'published' }, order: [['id', 'DESC']] });
	}
}
