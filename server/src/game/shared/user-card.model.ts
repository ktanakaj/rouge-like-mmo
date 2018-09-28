/**
 * ユーザーカードモデルモジュール。
 * @module ./game/shared/user-card.model
 */
import { Table, Column, DataType, AllowNull, Comment, Default, ForeignKey } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import DataModel from '../../core/models/data-model';
import User from './user.model';
import Card from './card.model';

/**
 * ユーザーカードモデルクラス。
 */
@Table({
	tableName: 'userCards',
	comment: 'ユーザー所有カード情報',
	timestamps: true,
})
export default class UserCard extends DataModel<UserCard> {
	/** ユーザーID */
	@ApiModelProperty({ description: 'ユーザーID' })
	@AllowNull(false)
	@ForeignKey(() => User)
	@Comment('ユーザーID')
	@Column
	userId: number;

	/** カードID */
	@ApiModelProperty({ description: 'カードID' })
	@AllowNull(false)
	@ForeignKey(() => Card)
	@Comment('カードID')
	@Column
	cardId: number;

	/** 同カード獲得数 */
	@ApiModelProperty({ description: '同カード獲得数' })
	@AllowNull(false)
	@Default(1)
	@Comment('同カード獲得数')
	@Column(DataType.BIGINT.UNSIGNED)
	count: number;
}
