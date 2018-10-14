/**
 * プレイヤーキャラクターモデルモジュール。
 * @module ./game/shared/player-character.model
 */
import { Column, DataType, AllowNull, Comment, Default, IsDate } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';

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

	/** レベル */
	@ApiModelProperty({ description: 'キャラクターレベル' })
	@AllowNull(false)
	@Default(1)
	@Comment('キャラクターレベル')
	@Column(DataType.INTEGER.UNSIGNED)
	level: number;

	/** キャラクター累計経験値 */
	@ApiModelProperty({ description: 'キャラクター累計経験値' })
	@AllowNull(false)
	@Default(0)
	@Comment('キャラクター累計経験値')
	@Column(DataType.BIGINT.UNSIGNED)
	exp: number;

	/** HP */
	@ApiModelProperty({ description: 'HP' })
	@AllowNull(false)
	@Comment('HP')
	@Column(DataType.INTEGER.UNSIGNED)
	hp: number;

	/** 所持金 */
	@ApiModelProperty({ description: '所持金' })
	@AllowNull(false)
	@Default(0)
	@Comment('所持金')
	@Column(DataType.BIGINT.UNSIGNED)
	money: number;

	// TODO: ちゃんと正規化する？
	/** 所持品 */
	@ApiModelProperty({ description: '所持品' })
	@AllowNull(false)
	@Comment('所持品')
	@Column(DataType.TEXT)
	items: {};

	// TODO: 武器と防具のIDを持つ？所持品に含める？

	/** カルマ */
	@ApiModelProperty({ description: 'カルマ' })
	@AllowNull(false)
	@Default(0)
	@Comment('カルマ')
	@Column(DataType.INTEGER.UNSIGNED)
	karma: number;

	/** 最終選択日時 */
	@ApiModelProperty({ description: '最終選択日時' })
	@AllowNull(false)
	@IsDate
	@Comment('最終選択日時')
	@Column
	lastSelected: Date;
}
