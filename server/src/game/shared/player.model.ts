/**
 * プレイヤーモデルモジュール。
 * @module ./game/shared/player.model
 */
import { Column, DataType, AllowNull, Default, IsDate } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import * as Random from 'random-js';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';
const random = new Random();

/**
 * プレイヤーモデルクラス。
 */
@Table({
	db: 'global',
	tableName: 'players',
	comment: 'プレイヤー情報',
	timestamps: true,
})
export default class Player extends DataModel<Player> {
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

	/** 認証用トークン */
	@ApiModelProperty({ description: '認証用トークン' })
	@Column
	authToken: string;

	/** 最終ログイン日時 */
	@ApiModelProperty({ description: '最終ログイン日時' })
	@AllowNull(false)
	@IsDate
	@Column
	lastLogin: Date;

	/**
	 * 新しい認証用トークンを生成する。
	 */
	generateAuthToken(): void {
		this.authToken = Player.randomToken();
	}

	/**
	 * ランダムなトークン用文字列を生成する。
	 * @returns トークン用文字列。
	 */
	static randomToken(): string {
		return random.string(20, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
	}
}
