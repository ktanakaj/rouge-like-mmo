/**
 * ダンジョンフロアモデルモジュール。
 * @module ./game/shared/floor.model
 */
import { Column, DataType, AllowNull, ForeignKey } from 'sequelize-typescript';
import { ApiModelProperty } from '@nestjs/swagger';
import { DataModel, Table } from '../../core/db';
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
	@Column
	dungeonId: number;

	/** フロア番号 */
	@ApiModelProperty({ description: 'フロア番号' })
	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	no: number;

	/** フロアレベル */
	@ApiModelProperty({ description: 'フロアレベル' })
	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	level: number;

	/** サーバーアドレス */
	@ApiModelProperty({ description: 'サーバーアドレス' })
	@AllowNull(false)
	@Column
	server: string;

	/** ポート番号 */
	@ApiModelProperty({ description: 'ポート番号' })
	@AllowNull(false)
	@Column(DataType.SMALLINT.UNSIGNED)
	port: number;

	/** 滞在プレイヤー数 */
	@ApiModelProperty({ description: '滞在プレイヤー数' })
	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	players: number;

	/** フロアマップ */
	@ApiModelProperty({ description: 'フロアマップ' })
	@AllowNull(false)
	@Column(DataType.TEXT)
	map: string;
}
