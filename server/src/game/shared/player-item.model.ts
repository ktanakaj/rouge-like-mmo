/**
 * プレイヤー所有アイテムモデルモジュール。
 * @module ./game/shared/player-item.model
 */
import { Column, DataType, AllowNull, Default, ForeignKey, DefaultScope } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table, DistributionKey } from '../../core/models/decorators';
import ShardableDataModel from '../../core/models/shardable-data-model';
import Player from './player.model';
import Item from './item.model';

/**
 * プレイヤー所有アイテムモデルクラス。
 * プレイヤーが所持するアイテムを管理する。
 * ※ キャラクターが持ち帰ったアイテム。
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
export default class PlayerItem extends ShardableDataModel<PlayerItem> {
	/** プレイヤーID */
	@DistributionKey
	@ApiModelProperty({ description: 'プレイヤーID' })
	@AllowNull(false)
	@ForeignKey(() => Player)
	@Column
	playerId: number;

	/** アイテムID */
	@ApiModelProperty({ description: 'アイテムID' })
	@AllowNull(false)
	@ForeignKey(() => Item)
	@Column
	itemId: number;

	/** 所持数 */
	@ApiModelProperty({ description: '所持数' })
	@AllowNull(false)
	@Default(1)
	@Column(DataType.INTEGER.UNSIGNED)
	count: number;
}
