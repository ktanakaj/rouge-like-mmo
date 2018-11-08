/**
 * @file game.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import Player from '../../game/shared/player.model';
import PlayerCharacter from '../../game/shared/player-character.model';
import { GameController } from './game.controller';

describe('GameController', () => {
	let module: TestingModule;
	let controller: GameController;
	let testplayer: Player;
	let testpc1: PlayerCharacter;

	before(async () => {
		testplayer = await Player.create({ id: 110, token: 'UNITTEST_TOKEN110', lastLogin: new Date() });
		testpc1 = await PlayerCharacter.create({ playerId: testplayer.id, name: 'PC110#1', hp: 100, items: {}, lastSelected: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [GameController],
		}).compile();
		controller = module.get<GameController>(GameController);
	});

	describe('#getStatus()', () => {
		it('成功', async () => {
			const result = await controller.getStatus(testplayer);
			assert.strictEqual(result.playerLevel, 1);
			assert.strictEqual(typeof result.server, 'string');
		});
	});

	describe('#start()', () => {
		it('成功', async () => {
			const result = await controller.start({ pcId: testpc1.id, dungeonId: 1 }, testplayer);
			assert.strictEqual(typeof result.server, 'string');
		});
	});
});
