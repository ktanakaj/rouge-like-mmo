/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/master/00000001-create-error-codes
 */
import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.createTable('errorCodes', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: false,
				comment: 'エラーコードID',
			},
			responseCode: {
				type: Sequelize.INTEGER,
				allowNull: false,
				comment: 'レスポンスコード',
			},
			errorCode: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				comment: 'エラーコード',
			},
			description: {
				type: Sequelize.STRING,
				defaultValue: '',
				allowNull: false,
				comment: '説明',
			},
			logLevel: {
				type: Sequelize.ENUM,
				values: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
				allowNull: false,
				comment: 'ログレベル',
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.dropTable('errorCodes');
	},
};
