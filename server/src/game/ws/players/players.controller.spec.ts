/**
 * @file players.controller.tsのテスト。
 */
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../../test-helper';
import { BadRequestError } from '../../../core/errors';
import Player from '../../../game/shared/player.model';
import { PlayersController } from './players.controller';

describe('PlayersController', () => {
	let module: TestingModule;
	let controller: PlayersController;
	const oldDate = new Date('2017-12-17T03:24:00');

	beforeAll(async () => {
		await Player.create({ id: 100, token: 'WS_UNITTEST_TOKEN100', lastLogin: oldDate });

		module = await testHelper.createTestingModule({
			controllers: [PlayersController],
		}).compile();
		controller = module.get<PlayersController>(PlayersController);
	});

	describe('#login()', () => {
		it('認証成功', async () => {
			const conn = { session: {} };
			const player = await controller.login({ id: 100, token: 'WS_UNITTEST_TOKEN100' }, conn as any);

			expect(conn.session['id']).toBe(100);
			expect(player.lastLogin.getTime()).toBeGreaterThan(oldDate.getTime());
		});

		it('認証失敗', async () => {
			// トークンが不一致の場合例外が投げられる
			const conn = { session: {} };
			await expect(controller.login({ id: 100, token: 'INVALID_TOKEN' }, conn as any)).rejects.toThrow(BadRequestError);
		});
	});
});
