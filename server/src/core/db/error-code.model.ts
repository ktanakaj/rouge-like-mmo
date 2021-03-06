/**
 * エラーコードマスタモデルモジュール。
 * @module ./shared/db/error-code.model
 */
import { Column, DataType, Unique, AllowNull, Default, Comment } from 'sequelize-typescript';
import { Table } from './shardable';
import MasterModel from './master-model';

/**
 * エラーコードマスタモデルクラス。
 */
@Table({
	db: 'master',
	tableName: 'errorCodes',
	comment: 'エラーコードマスタ',
	timestamps: false,
})
export default class ErrorCode extends MasterModel<ErrorCode> {
	/** レスポンスコード */
	@AllowNull(false)
	@Comment('レスポンスコード')
	@Column
	responseCode: number;

	/** エラーコード */
	@Unique
	@AllowNull(false)
	@Comment('エラーコード')
	@Column
	errorCode: string;

	/** 説明 */
	@AllowNull(false)
	@Default('')
	@Comment('説明')
	@Column
	description: string;

	/** ログレベル */
	@AllowNull(false)
	@Comment('ログレベル')
	@Column({
		type: DataType.ENUM,
		values: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
	})
	logLevel: string;

	/**
	 * エラーコードからマスタを取得する。
	 * @param errorCode エラーコード。
	 * @return マスタ。取得失敗時はnull。
	 */
	public static async findByErrorCode(errorCode: string): Promise<ErrorCode> {
		return await ErrorCode.findOne({ where: { errorCode } });
	}
}
