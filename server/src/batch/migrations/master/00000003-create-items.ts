/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/master/00000003-create-items
 */
import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.createTable('items', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: false,
				comment: 'アイテムID',
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				comment: 'アイテム名',
			},
			type: {
				type: Sequelize.ENUM,
				values: ['weapon', 'shield', 'cure', 'symbol'],
				allowNull: false,
				comment: 'アイテム種別',
			},
			rarity: {
				type: Sequelize.TINYINT.UNSIGNED,
				allowNull: false,
				comment: 'レア度',
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.dropTable('items');
	},
};
