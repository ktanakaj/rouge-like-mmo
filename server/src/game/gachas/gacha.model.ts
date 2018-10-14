/**
 * ガチャマスタモデルモジュール。
 * @module ./game/gachas/gacha.model
 */
import { Column, AllowNull, Comment, IsDate } from 'sequelize-typescript';
import { Table } from '../../core/models/decorators';
import MasterModel from '../../core/models/master-model';

/**
 * ガチャマスタモデルクラス。
 */
@Table({
	db: 'master',
	tableName: 'gachas',
	comment: 'ガチャマスタ',
})
export default class Gacha extends MasterModel<Gacha> {
	/** ガチャ名 */
	@AllowNull(false)
	@Comment('ガチャ名')
	@Column
	name: string;

	/** ガチャ種別 */
	@AllowNull(false)
	@Comment('ガチャ種別')
	@Column
	type: string;

	/** ガチャ期間開始 */
	@IsDate
	@Comment('ガチャ期間開始')
	@Column
	openAt: Date;

	/** ガチャ期間終了 */
	@IsDate
	@Comment('ガチャ期間終了')
	@Column
	closeAt: Date;
}
