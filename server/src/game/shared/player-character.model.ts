/**
 * プレイヤーキャラクターモデルモジュール。
 * @module ./game/shared/player-character.model
 */
import { Column, DataType, AllowNull, Default, IsDate, ForeignKey, IFindOptions, DefaultScope } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { ShardableModel, Table, DistributionKey } from '../../core/db';
import { NotFoundError } from '../../core/errors';
import Player from './player.model';

/**
 * プレイヤーキャラクターモデルクラス。
 *
 * ※ モデル上の主キーはidですが、playerIdによるシャーディングテーブルのため、
 *    idでは全シャードで一意になりません。必ずplayerIdも含めて処理してください。
 */
@DefaultScope({
	order: [
		['playerId', 'ASC'],
		['lastSelected', 'DESC'],
	],
})
@Table({
	db: 'shardable',
	tableName: 'playerCharacters',
	comment: 'プレイヤーキャラクター',
	timestamps: true,
})
export default class PlayerCharacter extends ShardableModel<PlayerCharacter> {
	// TODO: 最大HPや攻撃力をどう算出する？レベルから？それとも個別に持たせる？
	/** プレイヤーID */
	@DistributionKey
	@ApiModelProperty({ description: 'プレイヤーID' })
	@AllowNull(false)
	@ForeignKey(() => Player)
	@Column
	playerId: number;

	/** キャラクター名 */
	@ApiModelProperty({ description: 'キャラクター名' })
	@AllowNull(false)
	@Column
	name: string;

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
	@Column(DataType.JSON)
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

	/**
	 * レコードをプレイヤーIDとプレイヤーキャラクターIDで取得する。
	 * @param playerId プレイヤーID。
	 * @param pcId プレイヤーキャラクターID。
	 * @param options 検索オプション。
	 * @returns レコード。
	 * @throws NotFoundError レコードが存在しない場合。
	 */
	public static async findOrFail(playerId: number, pcId: number, options?: IFindOptions<PlayerCharacter>): Promise<PlayerCharacter> {
		const instance = await this.shard(playerId).findById(pcId, options);
		if (!instance || instance.playerId !== playerId) {
			throw new NotFoundError(this.name, pcId);
		}
		return instance;
	}

	/**
	 * プレイヤーと紐づく全てのレコードを取得する。
	 * @param playerId プレイヤーID。
	 * @param options 検索オプション。
	 * @returns レコード配列。
	 */
	public static async findAllByPlayerId(playerId: number, options: IFindOptions<PlayerCharacter> = {}): Promise<PlayerCharacter[]> {
		options.where = options.where || {};
		options.where['playerId'] = playerId;
		return await this.findAll(options);
	}
}
