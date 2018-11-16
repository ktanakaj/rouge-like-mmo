/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/global/00000010-create-floor
 */
import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.createTable('floors', {
			id: {
				type: Sequelize.BIGINT,
				allowNull: false,
				primaryKey: true,
				autoIncrement: false,
				comment: 'フロアID',
			},
			dungeonId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: 'ダンジョンID',
			},
			no: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: 'フロア番号',
			},
			level: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: 'フロアレベル',
			},
			server: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: 'サーバーアドレス',
			},
			port: {
				type: Sequelize.SMALLINT.UNSIGNED,
				allowNull: false,
				comment: 'ポート番号',
			},
			players: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: '滞在プレイヤー数',
			},
			map: {
				type: Sequelize.TEXT,
				allowNull: false,
				comment: 'フロアマップ',
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '作成日時',
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '更新日時',
			},
		});
		await queryInterface.addIndex('floors', ['dungeonId', 'no']);
	},
	down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.dropTable('floors');
	},
};
