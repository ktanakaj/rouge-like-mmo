/**
 * ダンジョンマスタモデルモジュール。
 * @module ./game/shared/dungeon.model
 */
import { Column, DataType, AllowNull, Comment } from 'sequelize-typescript';
import { Table } from '../../core/models/decorators';
import MasterModel from '../../core/models/master-model';

/**
 * ダンジョンマスタモデルクラス。
 */
@Table({
	db: 'master',
	tableName: 'dungeons',
	comment: 'ダンジョンマスタ',
})
export default class Dungeon extends MasterModel<Dungeon> {
	/** ダンジョン名 */
	@AllowNull(false)
	@Comment('ダンジョン名')
	@Column
	name: string;

	/** 難易度 */
	@AllowNull(false)
	@Comment('難易度')
	@Column(DataType.TINYINT.UNSIGNED)
	difficulty: number;

	/** 総フロア数 */
	@AllowNull(false)
	@Comment('総フロア数')
	@Column(DataType.INTEGER.UNSIGNED)
	numbers: number;
}
