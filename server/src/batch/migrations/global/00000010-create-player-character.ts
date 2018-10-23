/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/global/00000010-create-player-character
 */
import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.createTable('playerCharacters', {
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
			level: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 1,
				comment: 'キャラクターレベル',
			},
			exp: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				comment: 'キャラクター累計経験値',
			},
			hp: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				comment: 'HP',
			},
			money: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				comment: '所持金',
			},
			items: {
				type: Sequelize.TEXT,
				allowNull: false,
				comment: '所持品',
			},
			karma: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				comment: 'カルマ',
			},
			lastSelected: {
				type: Sequelize.DATE,
				comment: '最終選択日時',
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
		await queryInterface.addIndex('playerCharacters', ['playerId', { attribute: 'lastSelected', order: 'DESC' } as any]);
	},
	down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.dropTable('playerCharacters');
	},
};
