/**
 * @file masters.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { MastersController } from './masters.controller';

describe('http/MastersController', () => {
	let module: TestingModule;
	let controller: MastersController;

	before(async () => {
		module = await testHelper.createTestingModule({
			controllers: [MastersController],
		}).compile();
		controller = module.get<MastersController>(MastersController);
	});

	describe('#findLatestMasters()', () => {
		it('成功', async () => {
			const results = await controller.findLatestMasters();

			// マスタ名が1件以上返ること
			assert(Array.isArray(results));
			assert(results.length > 0);
		});
	});

	describe('#findLatestMaster()', () => {
		it('成功', async () => {
			const results = await controller.findLatestMaster('error-code');

			// マスタが1件以上返ること
			assert(Array.isArray(results));
			assert(results.length > 0);
		});
	});
});
