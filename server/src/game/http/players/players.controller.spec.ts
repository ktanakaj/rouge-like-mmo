/**
 * @file players.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { BadRequestError } from '../../../core/errors';
import Player from '../../shared/player.model';
import { PlayersController } from './players.controller';

describe('http/PlayersController', () => {
	let module: TestingModule;
	let controller: PlayersController;
	const oldDate = new Date('2017-12-17T03:24:00');

	beforeAll(async () => {
		await Player.create({ id: 105, token: 'UNITTEST_TOKEN105', lastLogin: oldDate });

		module = await testHelper.createTestingModule({
			controllers: [PlayersController],
		}).compile();
		controller = module.get<PlayersController>(PlayersController);
	});

	describe('#create()', () => {
		it('成功', async () => {
			const session = {};
			const player = await controller.create({ token: 'UNITTEST_NEW_TOKEN' }, session);
			expect(typeof session['user']['id']).toBe('number');
			expect(session['user']['id']).not.toBe(105);
			expect(player.lastLogin.getTime()).toBeGreaterThan(oldDate.getTime());

			const dbplayer = await Player.findByPkForAuth(session['user']['id']);
			expect(dbplayer.token).not.toBe('UNITTEST_NEW_TOKEN');
			expect(dbplayer.compareToken('UNITTEST_NEW_TOKEN')).toBeTruthy();
		});
	});

	describe('#login()', () => {
		it('認証成功', async () => {
			const session = {};
			const player = await controller.login({ id: 105, token: 'UNITTEST_TOKEN105' }, session);
			expect(session['user']['id']).toBe(105);
			expect(player.lastLogin.getTime()).toBeGreaterThan(oldDate.getTime());
		});

		it('プレイヤーID不一致', async () => {
			await expect(controller.login({ id: 9999, token: 'UNITTEST_TOKEN105' }, {})).rejects.toThrow(BadRequestError);
		});

		it('端末トークン不一致', async () => {
			await expect(controller.login({ id: 105, token: 'INVALID_TOKEN' }, {})).rejects.toThrow(BadRequestError);
		});
	});
});
