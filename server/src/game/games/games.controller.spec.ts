/**
 * @file games.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import Player from '../../game/shared/player.model';
import { GamesController } from './games.controller';

describe('GamesController', () => {
	let module: TestingModule;
	let controller: GamesController;

	before(async () => {
		await Player.create({ id: 101, authToken: 'OLD_TOKEN', lastLogin: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [GamesController],
		}).compile();
		controller = module.get<GamesController>(GamesController);
	});

	describe('#generateToken()', () => {
		it('成功', async () => {
			const result = await controller.generateToken({ id: 101 });
			assert.notEqual(result.token, 'OLD_TOKEN');
		});
	});
});
