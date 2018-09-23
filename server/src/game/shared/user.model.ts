/**
 * ユーザーモデルモジュール。
 * @module ./game/shared/user.model
 */
import { Table } from 'sequelize-typescript';
import DataModel from '../../core/models/data-model';

/**
 * ユーザーモデルクラス。
 */
@Table({
	tableName: 'users',
	comment: 'ユーザー情報',
	timestamps: true,
})
export default class User extends DataModel<User> {
}
