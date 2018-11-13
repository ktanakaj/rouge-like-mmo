/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/shardable/00000001-create-player
 */
import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.createTable('players', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: false,
				comment: 'プレイヤーID',
			},
			token: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: '端末トークン',
			},
			level: {
				type: Sequelize.INTEGER.UNSIGNED,
				allowNull: false,
				defaultValue: 1,
				comment: 'プレイヤーレベル',
			},
			exp: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				comment: 'プレイヤー累計経験値',
			},
			gameCoins: {
				type: Sequelize.BIGINT.UNSIGNED,
				allowNull: false,
				defaultValue: 0,
				comment: 'プレイヤー所持金',
			},
			lastLogin: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '最終ログイン日時',
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
	},
	down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.dropTable('players');
	},
};
