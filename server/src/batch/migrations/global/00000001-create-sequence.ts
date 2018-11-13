/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/global/00000001-create-sequence
 */
import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.createTable('sequences', {
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				primaryKey: true,
				comment: 'シーケンス名',
			},
			no: {
				type: Sequelize.BIGINT,
				allowNull: false,
				defaultValue: 0,
				comment: '値',
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.dropTable('sequences');
	},
};
