/**
 * ユーザーガチャ履歴モデルモジュール。
 * @module ./game/shared/user-card.model
 */
import { Column, DataType, AllowNull, Comment, Default, ForeignKey } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';
import User from '../shared/user.model';
import Gacha from './gacha.model';

/**
 * ユーザーガチャ履歴モデルクラス。
 */
@Table({
	db: 'global',
	tableName: 'userGachaLogs',
	comment: 'ユーザーガチャ履歴情報',
	createdAt: true,
	updatedAt: false,
})
export default class UserGachaLog extends DataModel<UserGachaLog> {
	/** ユーザーID */
	@ApiModelProperty({ description: 'ユーザーID' })
	@AllowNull(false)
	@ForeignKey(() => User)
	@Comment('ユーザーID')
	@Column
	userId: number;

	/** ガチャID */
	@ApiModelProperty({ description: 'ガチャID' })
	@AllowNull(false)
	@ForeignKey(() => Gacha)
	@Comment('ガチャID')
	@Column
	gachaId: number;

	/** ガチャ結果 */
	@ApiModelProperty({ description: 'ガチャ結果' })
	@AllowNull(false)
	@Comment('ガチャ結果')
	@Column(DataType.TEXT)
	result: { gachaItemIds: number[], payment: { gameCoins?: number, specialCoins?: number, freeSpecialCoins: number } };
}
