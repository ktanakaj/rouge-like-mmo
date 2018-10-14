/**
 * プレイヤー所有アイテムモデルモジュール。
 * @module ./game/shared/player-item.model
 */
import { Column, DataType, AllowNull, Comment, Default, ForeignKey } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';
import Player from './player.model';
import Item from './item.model';

/**
 * プレイヤー所有アイテムモデルクラス。
 * プレイヤーが所持するアイテムを管理する。
 * ※ キャラクターが持ち帰ったアイテム。
 */
@Table({
	db: 'global',
	tableName: 'playerItems',
	comment: 'プレイヤー所有アイテム情報',
	timestamps: true,
})
export default class PlayerItem extends DataModel<PlayerItem> {
	/** プレイヤーID */
	@ApiModelProperty({ description: 'プレイヤーID' })
	@AllowNull(false)
	@ForeignKey(() => Player)
	@Comment('プレイヤーID')
	@Column
	playerId: number;

	/** アイテムID */
	@ApiModelProperty({ description: 'アイテムID' })
	@AllowNull(false)
	@ForeignKey(() => Item)
	@Comment('アイテムID')
	@Column
	itemId: number;

	/** 所持数 */
	@ApiModelProperty({ description: '所持数' })
	@AllowNull(false)
	@Default(1)
	@Comment('所持数')
	@Column(DataType.BIGINT.UNSIGNED)
	count: number;
}
