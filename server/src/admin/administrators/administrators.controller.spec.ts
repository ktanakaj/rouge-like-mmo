/**
 * @file administrators.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError, NotFoundError } from '../../core/errors';
import Administrator from '../shared/administrator.model';
import { AdministratorsController } from './administrators.controller';

describe('admin/AdministratorsController', () => {
	let module: TestingModule;
	let controller: AdministratorsController;
	let testadmin1: Administrator;
	let testadmin2: Administrator;

	beforeAll(async () => {
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
			expect(result.count).toBeGreaterThan(0);
			expect(result.rows.length).toBeGreaterThan(0);

			const administrator = result.rows[0];
			expect(administrator.id).toBeGreaterThan(0);
			expect(administrator.name.length).toBeGreaterThan(0);
			expect(administrator.password).toBeUndefined();
		});
	});

	describe('#createAdministrator()', () => {
		it('成功', async () => {
			const administrator = await controller.createAdministrator({
				name: 'test1',
				role: 'admin',
				note: 'from POST /admin/administrators',
			});
			expect(administrator.id).toBeGreaterThan(0);
			expect(administrator.name).toBe('test1');
			expect(administrator.password.length).toBeGreaterThan(0);
			expect(administrator.note).toBe('from POST /admin/administrators');
		});

		it('name重複', async () => {
			try {
				await controller.createAdministrator({
					name: 'admin',
					role: 'admin',
				});
				fail('Missing expected exception');
			} catch (err) {
				expect(err.name).toBe('SequelizeUniqueConstraintError');
			}
		});
	});

	describe('#updateAdministrator()', () => {
		it('成功', async () => {
			const administrator = await controller.updateAdministrator({ id: testadmin1.id }, {
				note: 'from POST /admin/administrators/:id',
			});
			expect(administrator.id).toBe(testadmin1.id);
			expect(administrator.note).toBe('from POST /admin/administrators/:id');
		});

		it('データ未存在', async () => {
			await expect(controller.updateAdministrator({ id: 99999 }, {
				note: 'from POST /admin/administrators/:id',
			})).rejects.toThrow(NotFoundError);
		});

		it('name重複', async () => {
			try {
				await controller.updateAdministrator({ id: testadmin1.id }, {
					name: 'admin',
				});
				fail('Missing expected exception');
			} catch (err) {
				expect(err.name).toBe('SequelizeUniqueConstraintError');
			}
		});
	});

	describe('#deleteAdministrator()', () => {
		it('成功', async () => {
			const administrator = await controller.deleteAdministrator({ id: testadmin2.id });
			expect(administrator.id).toBe(testadmin2.id);
			expect(administrator.deletedAt).toBeTruthy();
		});

		it('データ未存在', async () => {
			await expect(controller.deleteAdministrator({ id: 99999 })).rejects.toThrow(NotFoundError);
		});
	});

	describe('#resetPassword()', () => {
		it('成功', async () => {
			const administrator = await controller.resetPassword({ id: testadmin1.id });
			expect(administrator.id).toBe(testadmin1.id);
			expect(administrator.password.length).toBe(12);
		});

		it('データ未存在', async () => {
			await expect(controller.resetPassword({ id: 99999 })).rejects.toThrow(NotFoundError);
		});
	});

	describe('#login()', () => {
		it('成功', async () => {
			const administrator = await controller.login({
				username: 'admin',
				password: 'admin01',
			}, {});
			expect(administrator.id).toBeGreaterThan(0);
			expect(administrator.name).toBe('admin');
			expect(administrator.password).toBeUndefined();
		});

		it('管理者名不一致', async () => {
			await expect(controller.login({
				username: 'invalid_name',
				password: 'admin01',
			}, {})).rejects.toThrow(BadRequestError);
		});

		it('パスワード不一致', async () => {
			await expect(controller.login({
				username: 'admin',
				password: 'invalid_password',
			}, {})).rejects.toThrow(BadRequestError);
		});
	});

	describe('#logout()', () => {
		it('成功', async () => {
			const session = {
				admin: { id: 1 },
			};
			await controller.logout(session);
			expect(session.admin).toBeUndefined();
		});
	});

	describe('#findMe()', () => {
		it('成功', async () => {
			const admin = testadmin1.toJSON();
			const me = await controller.findMe(admin);
			expect(me).toEqual(admin);
		});
	});

	describe('#updateMe()', () => {
		it('成功', async () => {
			const admin = testadmin1.toJSON();
			const administrator = await controller.updateMe({ password: 'UNITTEST' }, admin);
			expect(administrator.id).toBe(testadmin1.id);
			const adminWithNewPassword = await Administrator.scope('login').findByPk(testadmin1.id);
			expect(adminWithNewPassword.comparePassword('UNITTEST')).toBeTruthy();
		});
	});
});
