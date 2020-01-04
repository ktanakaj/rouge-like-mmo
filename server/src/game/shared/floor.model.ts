/**
 * ダンジョンフロアモデルモジュール。
 * @module ./game/shared/floor.model
 */
import { Column, DataType, AllowNull, ForeignKey } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { DataModel, Table } from '../../core/db';
import Dungeon from './dungeon.model';

/**
 * ダンジョンフロアモデルクラス。
 *
 * このアプリでは、「フロア」は複数のプレイヤーが入ってゲームを遊ぶ、
 * いわゆる「ルーム」としての機能も持つ。
 * （「ルーム」モデルだとマップの部屋と紛らわしいのでフロアにしている。）
 */
@Table({
	db: 'global',
	tableName: 'floors',
	comment: 'ダンジョンフロア',
	timestamps: true,
})
export default class Floor extends DataModel<Floor> {
	/** ダンジョンID */
	@ApiProperty({ description: 'ダンジョンID' })
	@AllowNull(false)
	@ForeignKey(() => Dungeon)
	@Column
	dungeonId: number;

	/** フロア番号 */
	@ApiProperty({ description: 'フロア番号' })
	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	no: number;

	/** フロアレベル */
	@ApiProperty({ description: 'フロアレベル' })
	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	level: number;

	/** サーバーアドレス */
	@ApiProperty({ description: 'サーバーアドレス' })
	@AllowNull(false)
	@Column
	server: string;

	/** ポート番号 */
	@ApiProperty({ description: 'ポート番号' })
	@AllowNull(false)
	@Column(DataType.SMALLINT.UNSIGNED)
	port: number;

	/** 滞在プレイヤー数 */
	@ApiProperty({ description: '滞在プレイヤー数' })
	@AllowNull(false)
	@Column(DataType.INTEGER.UNSIGNED)
	players: number;

	/** フロアマップ */
	@ApiProperty({ description: 'フロアマップ' })
	@AllowNull(false)
	@Column(DataType.TEXT)
	map: string;

	// 以下はメモリ上にのみ保持する情報

	// TODO: PCの居る位置。
	// TODO: モンスターの配置。
}
