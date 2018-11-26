/**
 * @file env.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { EnvController } from './env.controller';

describe('http/EnvController', () => {
	let module: TestingModule;
	let controller: EnvController;

	before(async () => {
		module = await testHelper.createTestingModule({
			controllers: [EnvController],
		}).compile();
		controller = module.get<EnvController>(EnvController);
	});

	describe('#getEnv()', () => {
		it('成功', async () => {
			const result = await controller.getEnv();

			assert(result.serverTime >= 1540507841);
			assert(/\d\.\d\.\d/.test(result.serverVersion));
			assert(/\d\.\d\.\d/.test(result.minimumAppVersion));
			assert(result.latestMasterVersion > 0);
		});
	});
});
