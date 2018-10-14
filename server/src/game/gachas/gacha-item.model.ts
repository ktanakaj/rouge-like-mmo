/**
 * ガチャアイテムマスタモデルモジュール。
 * @module ./game/gachas/gacha-item.model
 */
import { Column, DataType, AllowNull, Comment, IsDate, ForeignKey } from 'sequelize-typescript';
import { Table } from '../../core/models/decorators';
import MasterModel from '../../core/models/master-model';
import Gacha from './gacha.model';

/**
 * ガチャアイテムマスタモデルクラス。
 */
@Table({
	db: 'master',
	tableName: 'gachaItems',
	comment: 'ガチャアイテムマスタ',
})
export default class GachaItem extends MasterModel<GachaItem> {
	/** ガチャID */
	@AllowNull(false)
	@ForeignKey(() => Gacha)
	@Comment('ガチャID')
	@Column
	gachaId: number;

	/** ガチャアイテム種別 */
	@AllowNull(false)
	@Comment('ガチャアイテム種別')
	@Column
	type: string;

	/** ガチャアイテム報酬ID */
	@AllowNull(false)
	@Comment('ガチャアイテム報酬ID')
	@Column
	itemId: number;

	/** ガチャアイテム数 */
	@AllowNull(false)
	@Comment('ガチャアイテム数')
	@Column(DataType.INTEGER.UNSIGNED)
	count: number;

	/** 重み付け値 */
	@AllowNull(false)
	@Comment('重み付け値')
	@Column(DataType.INTEGER.UNSIGNED)
	weight: number;

	/** ガチャアイテム有効期間開始 */
	@IsDate
	@Comment('ガチャアイテム有効期間開始')
	@Column
	openAt: Date;

	/** ガチャアイテム有効期間終了 */
	@IsDate
	@Comment('ガチャアイテム有効期間終了')
	@Column
	closeAt: Date;
}
