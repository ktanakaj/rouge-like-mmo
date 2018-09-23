/**
 * ガチャマスタモデルモジュール。
 * @module ./game/gachas/gacha.model
 */
import { Table, Column, AllowNull, Comment, IsDate } from 'sequelize-typescript';
import MasterModel from '../../core/models/master-model';

/**
 * ガチャマスタモデルクラス。
 */
@Table({
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
