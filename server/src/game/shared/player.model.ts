/**
 * プレイヤーモデルモジュール。
 * @module ./game/shared/player.model
 */
import { Column, DataType, Unique, AllowNull, Default, IsDate, DefaultScope } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';

/**
 * プレイヤーモデルクラス。
 */
@DefaultScope({
	order: [
		['id', 'ASC'],
	],
})
@Table({
	db: 'global',
	tableName: 'players',
	comment: 'プレイヤー情報',
	timestamps: true,
})
export default class Player extends DataModel<Player> {
	/** 端末トークン */
	@ApiModelProperty({ description: '端末トークン' })
	@Unique
	@AllowNull(false)
	@Column
	token: string;

	/** プレイヤーレベル */
	@ApiModelProperty({ description: 'プレイヤーレベル' })
	@AllowNull(false)
	@Default(1)
	@Column(DataType.INTEGER.UNSIGNED)
	level: number;

	/** プレイヤー累計経験値 */
	@ApiModelProperty({ description: 'プレイヤー累計経験値' })
	@AllowNull(false)
	@Default(0)
	@Column(DataType.BIGINT.UNSIGNED)
	exp: number;

	/** プレイヤー所持金 */
	@ApiModelProperty({ description: 'プレイヤー所持金' })
	@AllowNull(false)
	@Default(0)
	@Column(DataType.BIGINT.UNSIGNED)
	gameCoins: number;

	/** 最終ログイン日時 */
	@ApiModelProperty({ description: '最終ログイン日時' })
	@AllowNull(false)
	@IsDate
	@Column
	lastLogin: Date;
}
