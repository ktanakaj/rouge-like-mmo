/**
 * @file administrators.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError, NotFoundError } from '../../core/errors';
import Administrator from '../shared/administrator.model';
import { AdministratorsController } from './administrators.controller';

describe('AdministratorsController', () => {
	let module: TestingModule;
	let controller: AdministratorsController;
	let testadmin1: Administrator;
	let testadmin2: Administrator;

	before(async () => {
		testadmin1 = await Administrator.create({ name: 'testadmin1', role: 'admin', password: 'admin01' });
		testadmin2 = await Administrator.create({ name: 'testadmin2', role: 'admin', password: 'admin01' });

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
				note: 'from POST /admin/administrators',
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

	describe('#updateAdministrator()', () => {
		it('成功', async () => {
			const administrator = await controller.updateAdministrator({ id: testadmin1.id }, {
				note: 'from POST /admin/administrators/:id',
			});
			assert.strictEqual(administrator.id, testadmin1.id);
			assert.strictEqual(administrator.note, 'from POST /admin/administrators/:id');
		});

		it('データ未存在', async () => {
			try {
				await controller.updateAdministrator({ id: 99999 }, {
					note: 'from POST /admin/administrators/:id',
				});
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof NotFoundError);
			}
		});

		it('name重複', async () => {
			try {
				await controller.updateAdministrator({ id: testadmin1.id }, {
					name: 'admin',
				});
				assert.fail('Missing expected exception');
			} catch (err) {
				assert.strictEqual(err.name, 'SequelizeUniqueConstraintError');
			}
		});
	});

	describe('#deleteAdministrator()', () => {
		it('成功', async () => {
			const administrator = await controller.deleteAdministrator({ id: testadmin2.id });
			assert.strictEqual(administrator.id, testadmin2.id);
			assert(administrator.deletedAt);
		});

		it('データ未存在', async () => {
			try {
				await controller.deleteAdministrator({ id: 99999 });
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof NotFoundError);
			}
		});
	});

	describe('#resetPassword()', () => {
		it('成功', async () => {
			const administrator = await controller.resetPassword({ id: testadmin1.id });
			assert.strictEqual(administrator.id, testadmin1.id);
			assert.strictEqual(administrator.password.length, 12);
		});

		it('データ未存在', async () => {
			try {
				await controller.resetPassword({ id: 99999 });
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof NotFoundError);
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

	describe('#findMe()', () => {
		it('成功', async () => {
			const admin = testadmin1.toJSON();
			const me = await controller.findMe(admin);
			assert.deepStrictEqual(me, admin);
		});
	});

	describe('#updateMe()', () => {
		it('成功', async () => {
			const admin = testadmin1.toJSON();
			const administrator = await controller.updateMe({ password: 'UNITTEST' }, admin);
			assert.strictEqual(administrator.id, testadmin1.id);
			const adminWithNewPassword = await Administrator.scope('login').findById(testadmin1.id);
			assert(adminWithNewPassword.comparePassword('UNITTEST'));
		});
	});
});
