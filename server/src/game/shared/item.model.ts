/**
 * アイテムマスタモデルモジュール。
 * @module ./game/shared/item.model
 */
import { Column, DataType, AllowNull, Comment } from 'sequelize-typescript';
import { MasterModel, Table } from '../../core/db';

/**
 * アイテムマスタモデルクラス。
 * 武器や防具、薬や食べ物など。
 */
@Table({
	db: 'master',
	tableName: 'items',
	comment: 'アイテムマスタ',
})
export default class Item extends MasterModel<Item> {
	/** アイテム種別定義 */
	static readonly TYPES = ['weapon', 'shield', 'cure', 'symbol'];

	/** アイテム名 */
	@AllowNull(false)
	@Comment('アイテム名')
	@Column
	name: string;

	/** アイテム種別 */
	@AllowNull(false)
	@Comment('アイテム種別')
	@Column({
		type: DataType.ENUM,
		values: Item.TYPES,
	})
	type: string;

	/** レア度 */
	@AllowNull(false)
	@Comment('レア度')
	@Column(DataType.TINYINT.UNSIGNED)
	rarity: number;

	// TODO: アイテムの効果とか
}
