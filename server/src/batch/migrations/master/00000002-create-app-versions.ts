/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/master/00000002-create-app-versions
 */
import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.createTable('appVersions', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: false,
				comment: 'アプリバージョンID',
			},
			version: {
				type: Sequelize.STRING,
				comment: '利用可能バージョン',
			},
			openAt: {
				type: Sequelize.DATE,
				comment: '有効期間開始',
			},
			closeAt: {
				type: Sequelize.DATE,
				comment: '有効期間終了',
			},
		});
	},
	down: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.dropTable('appVersions');
	},
};
