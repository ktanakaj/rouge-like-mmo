/**
 * @file masters.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import invokeContext from '../../shared/invoke-context';
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

	describe('#updateVersion()', () => {
		it('成功', async () => {
			const id = invokeContext.getMasterVersion();
			const version = await controller.updateVersion({ id }, { note: 'Updated by unittest' });
			assert.strictEqual(version.id, id);
			assert.strictEqual(version.note, 'Updated by unittest');
		});
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
