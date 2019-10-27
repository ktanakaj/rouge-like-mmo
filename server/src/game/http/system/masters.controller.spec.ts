/**
 * @file masters.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { MastersController } from './masters.controller';

describe('http/MastersController', () => {
	let module: TestingModule;
	let controller: MastersController;

	beforeAll(async () => {
		module = await testHelper.createTestingModule({
			controllers: [MastersController],
		}).compile();
		controller = module.get<MastersController>(MastersController);
	});

	describe('#findMasters()', () => {
		it('成功', async () => {
			const results = await controller.findMasters();

			// マスタ名が1件以上返ること
			expect(Array.isArray(results)).toBeTruthy();
			expect(results.length).toBeGreaterThan(0);
		});
	});

	describe('#findMaster()', () => {
		it('成功', async () => {
			const results = await controller.findMaster('error-code');

			// マスタが1件以上返ること
			expect(Array.isArray(results)).toBeTruthy();
			expect(results.length).toBeGreaterThan(0);
		});
	});
});
