/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/global/00000002-insert-sequence
 */
import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.bulkInsert('sequences', [{
			name: 'playerId',
		}]);
	},
	down: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.bulkDelete('sequences', { name: 'playerId' });
	},
};
