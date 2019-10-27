/**
 * @file player-characters.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { NotFoundError } from '../../../core/errors';
import Player from '../../shared/player.model';
import PlayerCharacter from '../../shared/player-character.model';
import { PlayerCharactersController } from './player-characters.controller';

describe('http/PlayerCharactersController', () => {
	let module: TestingModule;
	let controller: PlayerCharactersController;
	let testplayer: Player;
	let testpc1: PlayerCharacter;
	let testpc2: PlayerCharacter;

	beforeAll(async () => {
		testplayer = await Player.create({ id: 130, token: 'UNITTEST_TOKEN130', lastLogin: new Date() });
		testpc1 = await PlayerCharacter.create({ playerId: testplayer.id, name: 'PC130#1', hp: 100, items: {}, lastSelected: new Date() });
		testpc2 = await PlayerCharacter.create({ playerId: testplayer.id, name: 'PC130#2', hp: 100, items: {} });

		module = await testHelper.createTestingModule({
			controllers: [PlayerCharactersController],
		}).compile();
		controller = module.get<PlayerCharactersController>(PlayerCharactersController);
	});

	describe('#findAll()', () => {
		it('成功', async () => {
			const playerCharacters = await controller.findAll(testplayer);
			expect(playerCharacters.length).toBeGreaterThanOrEqual(1);
			expect(playerCharacters[0].id).toBe(testpc1.id);
		});
	});

	describe('#create()', () => {
		it('成功', async () => {
			const pc = await controller.create({
				name: 'test1',
			}, testplayer);
			expect(pc.id).toBeGreaterThan(0);
			expect(pc.playerId).toBe(testplayer.id);
			expect(pc.name).toBe('test1');
		});
	});

	describe('#update()', () => {
		it('成功', async () => {
			const pc = await controller.update({ id: testpc1.id }, {
				name: 'test2',
			}, testplayer);
			expect(pc.name).toBe('test2');
		});

		it('データ未存在', async () => {
			await expect(controller.update({ id: testpc1.id }, { name: 'test2' }, { id: 9999 })).rejects.toThrow(NotFoundError);
		});
	});

	describe('#delete()', () => {
		it('成功', async () => {
			const pc = await controller.delete({ id: testpc2.id }, testplayer);
			expect(pc.id).toBe(testpc2.id);
		});

		it('データ未存在', async () => {
			await expect(controller.delete({ id: testpc1.id }, { id: 9999 })).rejects.toThrow(NotFoundError);
		});
	});
});
