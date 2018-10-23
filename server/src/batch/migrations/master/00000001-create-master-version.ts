/**
 * DBマイグレーションスクリプト。
 * @module ./batch/migrations/master/00000001-create-master-version
 */
import { QueryInterface, SequelizeStatic } from 'sequelize';

module.exports = {
	up: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.createTable('masterVersions', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				comment: 'マスターバージョンID',
			},
			status: {
				type: Sequelize.ENUM,
				values: ['importing', 'readied', 'failed', 'published'],
				defaultValue: 'importing',
				allowNull: false,
				comment: '状態',
			},
			note: {
				type: Sequelize.STRING,
				defaultValue: '',
				allowNull: false,
				comment: '注記',
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '登録日時',
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				comment: '更新日時',
			},
		});
		await queryInterface.addIndex('masterVersions', ['status', { attribute: 'id', order: 'DESC' } as any]);
	},
	down: async (queryInterface: QueryInterface, Sequelize: SequelizeStatic) => {
		await queryInterface.dropTable('masterVersions');
	},
};
