/**
 * ダンジョンフロアモデルモジュール。
 * @module ./game/shared/floor.model
 */
import { Column, DataType, AllowNull, Comment, ForeignKey } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { Table } from '../../core/models/decorators';
import DataModel from '../../core/models/data-model';
import Dungeon from './dungeon.model';

/**
 * ダンジョンフロアモデルクラス。
 */
@Table({
	db: 'global',
	tableName: 'floors',
	comment: 'ダンジョンフロア',
	timestamps: true,
})
export default class Floor extends DataModel<Floor> {
	/** ダンジョンID */
	@ApiModelProperty({ description: 'ダンジョンID' })
	@AllowNull(false)
	@ForeignKey(() => Dungeon)
	@Comment('ダンジョンID')
	@Column
	dungeonId: number;

	/** フロア番号 */
	@ApiModelProperty({ description: 'フロア番号' })
	@AllowNull(false)
	@Comment('フロア番号')
	@Column(DataType.INTEGER.UNSIGNED)
	number: number;

	/** フロアレベル */
	@ApiModelProperty({ description: 'フロアレベル' })
	@AllowNull(false)
	@Comment('フロアレベル')
	@Column(DataType.INTEGER.UNSIGNED)
	level: number;

	/** サーバーアドレス */
	@ApiModelProperty({ description: 'サーバーアドレス' })
	@AllowNull(false)
	@Comment('サーバーアドレス')
	@Column
	server: string;

	/** 滞在プレイヤー数 */
	@ApiModelProperty({ description: '滞在プレイヤー数' })
	@AllowNull(false)
	@Comment('滞在プレイヤー数')
	@Column(DataType.INTEGER.UNSIGNED)
	players: number;

	/** フロアマップ */
	@ApiModelProperty({ description: 'フロアマップ' })
	@AllowNull(false)
	@Comment('フロアマップ')
	@Column(DataType.TEXT)
	map: {};
}
