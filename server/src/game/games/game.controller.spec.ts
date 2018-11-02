/**
 * @file game.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import Player from '../../game/shared/player.model';
import { GameController } from './game.controller';

describe('GameController', () => {
	let module: TestingModule;
	let controller: GameController;

	before(async () => {
		await Player.create({ id: 110, token: 'UNITTEST_TOKEN110', lastLogin: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [GameController],
		}).compile();
		controller = module.get<GameController>(GameController);
	});

	describe('#getStatus()', () => {
		it('成功', async () => {
			const result = await controller.getStatus({ id: 110, level: 1 });
			assert.strictEqual(result.playerLevel, 1);
			assert.strictEqual(typeof result.server, 'string');
		});
	});

	describe('#start()', () => {
		it('成功', async () => {
			const result = await controller.start({ dungeonId: 1 }, { id: 110, level: 1 });
			assert.strictEqual(typeof result.server, 'string');
		});
	});
});
