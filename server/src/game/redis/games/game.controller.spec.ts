/**
 * @file game.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { NotFoundError } from '../../../core/errors';
import Player from '../../shared/player.model';
import PlayerCharacter from '../../shared/player-character.model';
import { GameService } from '../../shared/game.service';
import { GameController } from './game.controller';

describe('redis/GameController', () => {
	let module: TestingModule;
	let controller: GameController;
	let testplayer: Player;
	let testpc1: PlayerCharacter;

	beforeAll(async () => {
		testplayer = await Player.create({ id: 150, token: 'UNITTEST_TOKEN150', lastLogin: new Date() });
		testpc1 = await PlayerCharacter.create({ playerId: testplayer.id, name: 'PC150#1', hp: 100, items: {}, lastSelected: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [GameController],
			providers: [GameService],
		}).compile();
		controller = module.get<GameController>(GameController);
	});

	describe('#create()', () => {
		it('成功', async () => {
			const floor = await controller.create({ playerId: testplayer.id, pcId: testpc1.id, dungeonId: 1 }, {} as any, 'CREATE_TEST1');
			expect(typeof floor.id).toBe('number');
			expect(floor.dungeonId).toBe(1);
			expect(floor.no).toBe(1);
		});

		it('ダンジョンID未存在', async () => {
			await expect(controller.create({ playerId: testplayer.id, pcId: testpc1.id, dungeonId: 999 }, {} as any, 'CREATE_TEST2'))
				.rejects.toThrow(NotFoundError);
		});

		it('プレイヤーキャラクターID未存在', async () => {
			await expect(controller.create({ playerId: testplayer.id, pcId: 9999, dungeonId: 1 }, {} as any, 'CREATE_TEST3'))
				.rejects.toThrow(NotFoundError);
		});
	});
});
