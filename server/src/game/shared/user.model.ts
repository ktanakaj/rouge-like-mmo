/**
 * ユーザーモデルモジュール。
 * @module ./game/shared/user.model
 */
import { Column, DataType, AllowNull, Comment, Default, IsDate } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';

/**
 * ユーザーモデルクラス。
 */
@Table({
	db: 'global',
	tableName: 'users',
	comment: 'ユーザー情報',
	timestamps: true,
})
export default class User extends DataModel<User> {
	/** ユーザーレベル */
	@ApiModelProperty({ description: 'ユーザーレベル' })
	@AllowNull(false)
	@Default(1)
	@Comment('ユーザーレベル')
	@Column(DataType.INTEGER.UNSIGNED)
	level: number;

	/** 総経験値 */
	@ApiModelProperty({ description: '総経験値' })
	@AllowNull(false)
	@Default(0)
	@Comment('総経験値')
	@Column(DataType.BIGINT.UNSIGNED)
	exp: number;

	/** ゲーム内通貨 */
	@ApiModelProperty({ description: 'ゲーム内通貨' })
	@AllowNull(false)
	@Default(0)
	@Comment('ゲーム内通貨')
	@Column(DataType.BIGINT.UNSIGNED)
	gameCoins: number;

	/** 課金通貨 */
	@ApiModelProperty({ description: '課金通貨' })
	@AllowNull(false)
	@Default(0)
	@Comment('課金通貨')
	@Column(DataType.BIGINT.UNSIGNED)
	specialCoins: number;

	/** 課金通貨（無償配布分） */
	@ApiModelProperty({ description: '課金通貨（無償配布分）' })
	@AllowNull(false)
	@Default(0)
	@Comment('課金通貨（無償配布分）')
	@Column(DataType.BIGINT.UNSIGNED)
	freeSpecialCoins: number;

	/** 最終ログイン日時 */
	@ApiModelProperty({ description: '最終ログイン日時' })
	@AllowNull(false)
	@IsDate
	@Comment('最終ログイン日時')
	@Column
	lastLogin: Date;
}
