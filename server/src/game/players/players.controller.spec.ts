/**
 * @file players.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError } from '../../core/errors';
import Player from '../../game/shared/player.model';
import { PlayersController } from './players.controller';

describe('PlayersController', () => {
	let module: TestingModule;
	let controller: PlayersController;
	const oldDate = new Date('2017-12-17T03:24:00');

	before(async () => {
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
			assert.strictEqual(typeof session['user']['id'], 'number');
			assert.notEqual(session['user']['id'], 105);
			assert(player.lastLogin.getTime() > oldDate.getTime());

			const dbplayer = await Player.scope('login').findById(session['user']['id']);
			assert.notEqual(dbplayer.token, 'UNITTEST_NEW_TOKEN');
			assert(dbplayer.compareToken('UNITTEST_NEW_TOKEN'));
		});
	});

	describe('#login()', () => {
		it('認証成功', async () => {
			const session = {};
			const player = await controller.login({ id: 105, token: 'UNITTEST_TOKEN105' }, session);
			assert.strictEqual(session['user']['id'], 105);
			assert(player.lastLogin.getTime() > oldDate.getTime());
		});

		it('プレイヤーID不一致', async () => {
			try {
				await controller.login({ id: 9999, token: 'UNITTEST_TOKEN105' }, {});
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof BadRequestError);
			}
		});

		it('端末トークン不一致', async () => {
			try {
				await controller.login({ id: 105, token: 'INVALID_TOKEN' }, {});
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof BadRequestError);
			}
		});
	});
});
