/**
 * @file games.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError } from '../../core/errors';
import { GamesController } from './games.controller';

describe('GamesController', () => {
	let module: TestingModule;
	let controller: GamesController;

	before(async () => {
		module = await testHelper.createTestingModule({
			controllers: [GamesController],
		}).compile();
		controller = module.get<GamesController>(GamesController);
	});

	describe('#getStatus()', () => {
		it('成功', async () => {
		});
	});

	describe('#getFloor()', () => {
		it('成功', async () => {
		});
	});
});
