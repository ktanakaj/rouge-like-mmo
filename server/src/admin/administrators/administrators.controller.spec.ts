/**
* @file administrators.controller.tsのテスト。
*/
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError } from '../../core/errors';
import { AdministratorsController } from './administrators.controller';

describe('AdministratorsController', () => {
	let module: TestingModule;
	let controller: AdministratorsController;

	before(async () => {
		module = await testHelper.createTestingModule({
			controllers: [AdministratorsController],
		}).compile();
		controller = module.get<AdministratorsController>(AdministratorsController);
	});

	describe('#findAndCountAdministrators()', () => {
		it('成功', async () => {
			const result = await controller.findAndCountAdministrators({ page: 1, max: 1000 });
			assert(result.count > 0);
			assert(result.rows.length > 0);

			const administrator = result.rows[0];
			assert(administrator.id > 0);
			assert(administrator.name.length > 0);
			assert.strictEqual(administrator.password, undefined);
		});
	});

	describe('#createAdministrator()', () => {
		it('成功', async () => {
			const administrator = await controller.createAdministrator({
				name: 'test1',
				role: 'admin',
				note: 'from POST /admin/administrators'
			});
			assert(administrator.id > 0);
			assert.strictEqual(administrator.name, 'test1');
			assert(administrator.password.length > 0);
			assert.strictEqual(administrator.note, 'from POST /admin/administrators');
		});

		it('name重複', async () => {
			try {
				await controller.createAdministrator({
					name: 'admin',
					role: 'admin',
				});
				assert.fail('Missing expected exception');
			} catch (err) {
				assert.strictEqual(err.name, 'SequelizeUniqueConstraintError');
			}
		});
	});

	describe('#login()', () => {
		it('成功', async () => {
			const administrator = await controller.login({
				username: 'admin',
				password: 'admin01',
			}, {});
			assert(administrator.id > 0);
			assert.strictEqual(administrator.name, 'admin');
			assert.strictEqual(administrator.password, undefined);
		});

		it('管理者名不一致', async () => {
			try {
				await controller.login({
					username: 'invalid_name',
					password: 'admin01',
				}, {});
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof BadRequestError);
			}
		});

		it('パスワード不一致', async () => {
			try {
				await controller.login({
					username: 'admin',
					password: 'invalid_password',
				}, {});
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof BadRequestError);
			}
		});
	});

	describe('#logout()', () => {
		it('成功', async () => {
			const session = {
				admin: { id: 1 },
			};
			await controller.logout(session);
			assert.strictEqual(session.admin, undefined);
		});
	});
});
