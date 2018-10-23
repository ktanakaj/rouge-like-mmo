/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/admin/00000001-create-administrator
 */
import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.createTable('administrators', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: '管理者ID',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				comment: '管理者名',
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: 'パスワード',
			},
			role: {
				type: Sequelize.ENUM,
				values: ['admin', 'writable', 'readonly'],
				allowNull: false,
				comment: 'ロール',
			},
			note: {
				type: Sequelize.STRING,
				defaultValue: '',
				allowNull: false,
				comment: '備考',
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '登録日時',
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '更新日時',
			},
			deletedAt: {
				type: Sequelize.DATE,
				comment: '削除日時',
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.dropTable('administrators');
	},
};
