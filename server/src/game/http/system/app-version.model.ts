/**
 * アプリバージョンマスタモデルモジュール。
 * @module ./game/http/system/app-version.model
 */
import { Column, Comment } from 'sequelize-typescript';
import { Table } from '../../../core/models/decorators';
import MasterModel from '../../../core/models/master-model';

/**
 * アプリバージョンマスタモデルクラス。
 * サーバーとクライアントのバージョン合わせ用。
 */
@Table({
	db: 'master',
	tableName: 'appVersions',
	comment: 'アプリバージョンマスタ',
})
export default class AppVersion extends MasterModel<AppVersion> {
	/** 利用可能バージョン（これ未満のバージョンはバージョンアップ必須） */
	@Comment('利用可能バージョン')
	@Column
	version: string;

	/** 有効期間開始 */
	@Comment('有効期間開始')
	@Column
	openAt: Date;

	/** 有効期間終了 */
	@Comment('有効期間終了')
	@Column
	closeAt: Date;
}
