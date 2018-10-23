/**
 * プレイヤーキャラクターモデルモジュール。
 * @module ./game/shared/player-character.model
 */
import { Column, DataType, AllowNull, Comment, Default, IsDate, ForeignKey } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';
import Player from './player.model';

/**
 * プレイヤーキャラクターモデルクラス。
 */
@Table({
	db: 'global',
	tableName: 'playerCharacters',
	comment: 'プレイヤーキャラクター',
	timestamps: true,
})
export default class PlayerCharacter extends DataModel<PlayerCharacter> {
	// TODO: 最大HPや攻撃力をどう算出する？レベルから？それとも個別に持たせる？
	/** プレイヤーID */
	@ApiModelProperty({ description: 'プレイヤーID' })
	@AllowNull(false)
	@ForeignKey(() => Player)
	@Column
	playerId: number;

	/** レベル */
	@ApiModelProperty({ description: 'キャラクターレベル' })
	@AllowNull(false)
	@Default(1)
	@Column(DataType.INTEGER.UNSIGNED)
	level: number;

	/** キャラクター累計経験値 */
	@ApiModelProperty({ description: 'キャラクター累計経験値' })
	@AllowNull(false)
	@Default(0)
	@Column(DataType.BIGINT.UNSIGNED)
	exp: number;

	/** HP */
	@ApiModelProperty({ description: 'HP' })
	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	hp: number;

	/** 所持金 */
	@ApiModelProperty({ description: '所持金' })
	@AllowNull(false)
	@Default(0)
	@Column(DataType.BIGINT.UNSIGNED)
	money: number;

	// TODO: ちゃんと正規化する？
	/** 所持品 */
	@ApiModelProperty({ description: '所持品' })
	@AllowNull(false)
	@Column(DataType.TEXT)
	items: {};

	// TODO: 武器と防具のIDを持つ？所持品に含める？

	/** カルマ */
	@ApiModelProperty({ description: 'カルマ' })
	@AllowNull(false)
	@Default(0)
	@Column(DataType.INTEGER.UNSIGNED)
	karma: number;

	/** 最終選択日時 */
	@ApiModelProperty({ description: '最終選択日時' })
	@IsDate
	@Column
	lastSelected: Date;
}
