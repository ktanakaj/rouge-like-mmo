/**
 * プレイヤーモデルモジュール。
 * @module ./game/shared/player.model
 */
import { Column, DataType, AllowNull, Default, IsDate, DefaultScope, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import * as crypto from 'crypto';
import * as config from 'config';
import * as Random from 'random-js';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';
const random = new Random();

/**
 * プレイヤーモデルクラス。
 */
@DefaultScope({
	attributes: {
		exclude: ['token'],
	},
	order: [
		['id', 'ASC'],
	],
})
@Table({
	db: 'global',
	tableName: 'players',
	comment: 'プレイヤー情報',
	timestamps: true,
	scopes: {
		login: {}, // passwordを除外しない
	},
})
export default class Player extends DataModel<Player> {
	/** 端末トークン（パスワードに準じた扱いをする） */
	@ApiModelProperty({ description: '端末トークン' })
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

	/**
	 * 端末トークンをハッシュ化する。
	 * @param player 更新されるプレイヤー。
	 */
	@BeforeCreate
	@BeforeUpdate
	static hashTokenIfChanged(player: Player): void {
		// 新しいトークンが設定されている場合、自動でハッシュ化する
		if (player.token !== undefined && player.token !== '' && player.token !== player.previous('token')) {
			player.token = Player.passwordToHash(player.token);
		}
	}

	/**
	 * 渡された端末トークンをハッシュ化された値と比較する。
	 * @param token 比較するトークン。
	 * @returns 一致する場合true。
	 * @throws Error パスワード未読み込み。
	 */
	compareToken(token: string): boolean {
		if (this.token == null) {
			throw new Error('this.token is unloaded');
		}
		// salt;ハッシュ値 のデータからsaltを取り出し、そのsaltで計算した結果と比較
		return this.token === Player.passwordToHash(token, this.token.split(';')[0]);
	}

	/**
	 * 渡されたパスワードをハッシュ値に変換する。
	 * @param password 変換するパスワード。
	 * @param salt 変換に用いるsalt。未指定時は内部で乱数から生成。
	 * @returns saltとハッシュ値を結合した文字列。
	 */
	static passwordToHash(password: string, salt?: string): string {
		if (salt === undefined) {
			salt = random.string(4, '0123456789ABCDEF');
		}
		const hashGenerator = crypto.createHash(config['password']['algorithm']);
		hashGenerator.update(salt);
		hashGenerator.update(password);
		return salt + ';' + hashGenerator.digest('hex');
	}
}
