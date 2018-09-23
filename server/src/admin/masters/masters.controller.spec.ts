/**
* @file masters.controller.tsのテスト。
*/
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { MastersController } from './masters.controller';

describe('MastersController', () => {
	let module: TestingModule;
	let controller: MastersController;

	before(async () => {
		module = await testHelper.createTestingModule({
			controllers: [MastersController],
		}).compile();
		controller = module.get<MastersController>(MastersController);
	});

	describe('#findAndCountVersions()', () => {
		it('成功', async () => {
			const result = await controller.findAndCountVersions({ page: 1, max: 1000 });
			assert(result.count > 0);
			assert(result.rows.length > 0);

			const version = result.rows[0];
			assert(version.id > 0);
			assert.notStrictEqual(version.status, null);
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
