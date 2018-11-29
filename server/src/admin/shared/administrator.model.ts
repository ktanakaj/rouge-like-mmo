/**
 * 管理者モデルクラスモジュール。
 * @module ./admin/shared/administrator.model
 */
import { Column, DataType, Unique, AllowNull, Default, DefaultScope, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import * as crypto from 'crypto';
import * as config from 'config';
import * as Random from 'random-js';
import { DataModel, Table } from '../../core/db';
const random = new Random();

/**
 * 管理者モデルクラス。
 */
@DefaultScope({
	attributes: {
		exclude: ['password'],
	},
	order: [
		['name', 'ASC'],
		['id', 'ASC'],
	],
})
@Table({
	db: 'admin',
	tableName: 'administrators',
	comment: '管理者',
	timestamps: true,
	paranoid: true,
	scopes: {
		login: {}, // passwordを除外しない
	},
})
export default class Administrator extends DataModel<Administrator> {
	/** ロール定義 */
	static readonly ROLES = ['admin', 'writable', 'readonly'];

	/** 管理者名 */
	@ApiModelProperty({ description: '管理者名' })
	@Unique
	@AllowNull(false)
	@Column
	name: string;

	/** パスワード */
	@ApiModelPropertyOptional({ description: 'パスワード' })
	@AllowNull(false)
	@Column
	password: string;

	/** ロール */
	@ApiModelProperty({ description: 'ロール' })
	@AllowNull(false)
	@Column({
		type: DataType.ENUM,
		values: Administrator.ROLES,
	})
	role: string;

	/** 備考 */
	@ApiModelProperty({ description: '備考' })
	@AllowNull(false)
	@Default('')
	@Column
	note: string;

	/**
	 * パスワードをハッシュ化する。
	 * @param admin 更新される管理者。
	 */
	@BeforeCreate
	@BeforeUpdate
	static hashPasswordIfChanged(admin: Administrator): void {
		// 新しいパスワードが設定されている場合、自動でハッシュ化する
		if (admin.password !== undefined && admin.password !== '' && admin.password !== admin.previous('password')) {
			admin.password = Administrator.passwordToHash(admin.password);
		}
	}

	/**
	 * 渡されたパスワードをハッシュ化された値と比較する。
	 * @param password 比較するパスワード。
	 * @returns 一致する場合true。
	 * @throws Error パスワード未読み込み。
	 */
	comparePassword(password: string): boolean {
		if (this.password == null) {
			throw new Error('this.password is unloaded');
		}
		// salt;ハッシュ値 のデータからsaltを取り出し、そのsaltで計算した結果と比較
		return this.password === Administrator.passwordToHash(password, this.password.split(';')[0]);
	}

	/**
	 * 渡されたパスワードをハッシュ値に変換する。
	 * @param password 変換するパスワード。
	 * @param salt 変換に用いるsalt。未指定時は内部で乱数から生成。
	 * @returns saltとハッシュ値を結合した文字列。
	 */
	static passwordToHash(password: string, salt?: string): string {
		if (salt === undefined) {
			salt = random.string(4, '0123456789ABCDEF');
		}
		const hashGenerator = crypto.createHash(config['password']['algorithm']);
		hashGenerator.update(salt);
		hashGenerator.update(password);
		return salt + ';' + hashGenerator.digest('hex');
	}

	/**
	 * ランダムなパスワード用文字列を生成する。
	 * @returns パスワード用文字列。
	 */
	static randomPassword(): string {
		// 間違えやすい文字を除いたランダムな文字列
		return random.string(12, '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
	}
}
