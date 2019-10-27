/**
 * @file env.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { EnvController } from './env.controller';

describe('http/EnvController', () => {
	let module: TestingModule;
	let controller: EnvController;

	beforeAll(async () => {
		module = await testHelper.createTestingModule({
			controllers: [EnvController],
		}).compile();
		controller = module.get<EnvController>(EnvController);
	});

	describe('#getEnv()', () => {
		it('成功', async () => {
			const result = await controller.getEnv();

			expect(result.serverTime).toBeGreaterThanOrEqual(1540507841);
			expect(result.serverVersion).toMatch(/\d\.\d\.\d/);
			expect(result.minimumAppVersion).toMatch(/\d\.\d\.\d/);
		});
	});
});
