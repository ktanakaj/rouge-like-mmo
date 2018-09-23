/**
 * マスタバージョンモデルクラスモジュール。
 * @module ./shared/master-version.model
 */
import { Model, Table, Column, DataType, AllowNull, Default, Comment, DefaultScope, IFindOptions } from 'sequelize-typescript';
import { DefineIndexesOptions } from 'sequelize';
import { ApiModelProperty } from '@nestjs/swagger';
import { NotFoundError } from '../core/errors';
import MasterModel from '../core/models/master-model';

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
	tableName: 'masterVersions',
	comment: 'マスタバージョンマスタ',
	timestamps: true,
	indexes: [{
		fields: ['status', { attribute: 'id', order: 'DESC' }],
	}] as DefineIndexesOptions[],
})
export default class MasterVersion extends Model<MasterVersion> {
	// 複数バージョンのマスタを保持し、かつそのバージョンの有効無効を切り替えられるようにする。

	/** 状態定義 */
	static readonly STATUSES = ['importing', 'readied', 'failed', 'published'];

	/** 状態 */
	@ApiModelProperty({ description: '状態' })
	@AllowNull(false)
	@Default('importing')
	@Comment('状態')
	@Column({
		type: DataType.ENUM,
		values: MasterVersion.STATUSES,
	})
	status: string;

	/** 注記 */
	@ApiModelProperty({ description: '注記' })
	@AllowNull(false)
	@Default('')
	@Comment('注記')
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
	static async findOrFail(id: number, options?: IFindOptions<MasterVersion>): Promise<MasterVersion> {
		const instance = await this.findById(id, options);
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

	/**
	 * マスタバージョンを設定したゾーンを開始する。
	 * @param id マスタバージョンを指定する場合そのID。未指定時は最新の公開マスタ。
	 */
	static async zoneMasterVersion(id: number = null): Promise<void> {
		// 本当はZone.js等でゾーンを作ってそこにリクエストごとの情報として持ちたいが、
		// bluebirdと衝突して（？）意図通り動かなかったため、staicプロパティで代用。
		// この実装だと、運用中にマスタが更新された場合、処理の途中に突然バージョンが変わる可能性有。
		if (id === null) {
			const m = await MasterVersion.findLatest();
			id = m ? m.id : 0;
		}
		MasterModel.MASTER_VERSION = id;
	}
}
