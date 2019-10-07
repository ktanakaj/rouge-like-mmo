/**
 * シーケンスモデルモジュール。
 * @module ./shared/sequence.model
 */
import { Model, Column, DataType, PrimaryKey, AllowNull, Comment } from 'sequelize-typescript';
import { Table } from '../core/db';
import { NotFoundError } from '../core/errors';

/**
 * シーケンスモデルクラス。
 *
 * Oracleなどにあるシーケンスのような事をするためのテーブル。
 */
@Table({
	db: 'global',
	tableName: 'sequences',
	comment: 'シーケンス',
})
export default class Sequence extends Model<Sequence> {
	/** シーケンス名 */
	@PrimaryKey
	@Comment('シーケンス名')
	@Column
	name: string;

	/** 値 */
	@AllowNull(false)
	@Comment('値')
	@Column(DataType.BIGINT)
	no: number;

	/**
	 * 新しい番号を採番する。
	 * @param name シーケンス名。
	 * @return 採番された番号。
	 */
	public static async incrementNo(name: string): Promise<number> {
		// ※ sequelizeで完結させているのでやや非効率かも。プロシージャとか使った方がよいか
		return await this.sequelize.transaction(async (t) => {
			await this.increment('no', { where: { name }, transaction: t });
			const sequence = await this.findByPk(name, { transaction: t });
			if (!sequence) {
				throw new NotFoundError(this.name, name);
			}
			return sequence.no;
		});
	}
}
