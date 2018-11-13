/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/shardable/00000002-create-player-item
 */
import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.createTable('playerItems', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: 'プレイヤーアイテムID',
			},
			playerId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: 'プレイヤーID',
				// TODO: 外部キー制約を使うか未確定のため一旦コメントアウト
				// references: {
				// 	model: 'players',
				// 	key: 'id',
				// }
			},
			itemId: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: 'アイテムID',
			},
			count: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 1,
				comment: '所持数',
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
		await queryInterface.addIndex('playerItems', ['playerId', 'itemId']);
		await queryInterface.addIndex('playerItems', ['itemId', 'playerId']);
	},
	down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.dropTable('playerItems');
	},
};
