/**
 * @file player-characters.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { NotFoundError } from '../../core/errors';
import Player from '../../game/shared/player.model';
import PlayerCharacter from '../../game/shared/player-character.model';
import { PlayerCharactersController } from './player-characters.controller';

describe('PlayerCharactersController', () => {
	let module: TestingModule;
	let controller: PlayerCharactersController;
	let testplayer: Player;
	let testpc1: PlayerCharacter;
	let testpc2: PlayerCharacter;

	before(async () => {
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
			assert(playerCharacters.length >= 1);
			assert.strictEqual(playerCharacters[0].id, testpc1.id);
		});
	});

	describe('#create()', () => {
		it('成功', async () => {
			const pc = await controller.create({
				name: 'test1',
			}, testplayer);
			assert(pc.id > 0);
			assert.strictEqual(pc.playerId, testplayer.id);
			assert.strictEqual(pc.name, 'test1');
		});
	});

	describe('#update()', () => {
		it('成功', async () => {
			const pc = await controller.update({ id: testpc1.id }, {
				name: 'test2',
			}, testplayer);
			assert.strictEqual(pc.name, 'test2');
		});

		it('データ未存在', async () => {
			try {
				await controller.update({ id: testpc1.id }, {
					name: 'test2',
				}, { id: 9999 });
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof NotFoundError);
			}
		});
	});

	describe('#delete()', () => {
		it('成功', async () => {
			const pc = await controller.delete({ id: testpc2.id }, testplayer);
			assert.strictEqual(pc.id, testpc2.id);
		});

		it('データ未存在', async () => {
			try {
				await controller.delete({ id: testpc1.id }, { id: 9999 });
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof NotFoundError);
			}
		});
	});
});
