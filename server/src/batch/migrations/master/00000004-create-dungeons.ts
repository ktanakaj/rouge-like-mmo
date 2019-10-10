/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/master/00000004-create-dungeons
 */
import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.createTable('dungeons', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: false,
				comment: 'ダンジョンID',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: 'ダンジョン名',
			},
			difficulty: {
				type: Sequelize.TINYINT.UNSIGNED,
				allowNull: false,
				comment: '難易度',
			},
			numbers: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '総フロア数',
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.dropTable('dungeons');
	},
};
