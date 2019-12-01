/**
 * プレイヤー所有アイテムモデルモジュール。
 * @module ./game/shared/player-item.model
 */
import { Column, DataType, AllowNull, Default, ForeignKey, DefaultScope } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { ShardableModel, Table, DistributionKey } from '../../core/db';
import Player from './player.model';
import Item from './item.model';

/**
 * プレイヤー所有アイテムモデルクラス。
 * プレイヤーが所持するアイテムを管理する。
 *
 * ※ キャラクターが持ち帰ったアイテム。
 * ※ モデル上の主キーはidですが、playerIdによるシャーディングテーブルのため、
 *    idでは全シャードで一意になりません。必ずplayerIdも含めて処理してください。
 */
@DefaultScope({
	order: [
		['playerId', 'ASC'],
		['itemId', 'ASC'],
	],
})
@Table({
	db: 'shardable',
	tableName: 'playerItems',
	comment: 'プレイヤー所有アイテム情報',
	timestamps: true,
})
export default class PlayerItem extends ShardableModel<PlayerItem> {
	/** プレイヤーID */
	@DistributionKey
	@ApiProperty({ description: 'プレイヤーID' })
	@AllowNull(false)
	@ForeignKey(() => Player)
	@Column
	playerId: number;

	/** アイテムID */
	@ApiProperty({ description: 'アイテムID' })
	@AllowNull(false)
	@ForeignKey(() => Item)
	@Column
	itemId: number;

	/** 所持数 */
	@ApiProperty({ description: '所持数' })
	@AllowNull(false)
	@Default(1)
	@Column(DataType.INTEGER.UNSIGNED)
	count: number;
}
