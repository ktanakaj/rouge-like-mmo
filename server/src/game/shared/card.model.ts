/**
 * カードマスタモデルモジュール。
 * @module ./game/shared/card.model
 */
import { Table, Column, DataType, AllowNull, Comment } from 'sequelize-typescript';
import MasterModel from '../../core/models/master-model';

/**
 * カードマスタモデルクラス。
 */
@Table({
	tableName: 'cards',
	comment: 'カードマスタ',
})
export default class Card extends MasterModel<Card> {
	/** カード名 */
	@AllowNull(false)
	@Comment('カード名')
	@Column
	name: string;

	/** レア度 */
	@AllowNull(false)
	@Comment('レア度')
	@Column(DataType.TINYINT.UNSIGNED)
	rarity: number;
}
