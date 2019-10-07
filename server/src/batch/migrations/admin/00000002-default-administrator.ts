/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/admin/00000002-default-administrator
 */
import { QueryInterface } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.bulkInsert('administrators', [{
			name: 'admin',
			password: 'EA46;88e6398997c4a7d3262e76d3f5a3a8c36e08f998a8110f83873c8fab0ea3f41a', // admin01
			role: 'admin',
			note: '初期管理者',
			createdAt: new Date(),
			updatedAt: new Date(),
		}]);
	},
	down: async (queryInterface: QueryInterface, Sequelize) => {
		await queryInterface.bulkDelete('administrators', { name: 'admin' });
	},
};
