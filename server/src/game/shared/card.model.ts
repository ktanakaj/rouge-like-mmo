/**
 * カードマスタモデルモジュール。
 * @module ./game/shared/card.model
 */
import { Column, DataType, AllowNull, Comment } from 'sequelize-typescript';
import { Table } from '../../core/models/decorators';
import MasterModel from '../../core/models/master-model';

/**
 * カードマスタモデルクラス。
 */
@Table({
	db: 'master',
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
