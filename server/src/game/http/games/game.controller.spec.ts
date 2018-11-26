/**
 * @file game.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import Player from '../../shared/player.model';
import PlayerCharacter from '../../shared/player-character.model';
import { GameService } from '../../shared/game.service';
import { GameController } from './game.controller';

describe('http/GameController', () => {
	let module: TestingModule;
	let controller: GameController;
	let testplayer: Player;
	let testpc1: PlayerCharacter;

	before(async () => {
		testplayer = await Player.create({ id: 110, token: 'UNITTEST_TOKEN110', lastLogin: new Date() });
		testpc1 = await PlayerCharacter.create({ playerId: testplayer.id, name: 'PC110#1', hp: 100, items: {}, lastSelected: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [GameController],
			providers: [GameService],
		}).compile();
		controller = module.get<GameController>(GameController);
	});

	describe('#getStatus()', () => {
		it('成功', async () => {
			const result = await controller.getStatus(testplayer, { headers: { host: 'localhost' } });
			assert.strictEqual(result.playerLevel, 1);
			assert.strictEqual(result.url, 'ws://localhost/ws/');
		});
	});

	describe('#start()', () => {
		it('成功', async () => {
			const url = await controller.start({ pcId: testpc1.id, dungeonId: 1 }, testplayer, { headers: { host: 'localhost' } });
			assert.strictEqual(url, 'ws://localhost/ws/');
		});
	});
});