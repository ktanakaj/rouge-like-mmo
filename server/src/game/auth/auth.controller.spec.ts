/**
 * @file auth.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import Player from '../../game/shared/player.model';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
	let module: TestingModule;
	let controller: AuthController;
	const oldDate = new Date('2017-12-17T03:24:00');

	before(async () => {
		await Player.create({ id: 105, token: 'UNITTEST_TOKEN105', lastLogin: oldDate });

		module = await testHelper.createTestingModule({
			controllers: [AuthController],
		}).compile();
		controller = module.get<AuthController>(AuthController);
	});

	describe('#auth()', () => {
		it('認証成功', async () => {
			const session = {};
			await controller.auth({ token: 'UNITTEST_TOKEN105' }, session);
			assert.strictEqual(session['user']['id'], 105);
			assert.strictEqual(session['user']['token'], 'UNITTEST_TOKEN105');

			const player = await Player.findOrFail(105);
			assert(player.lastLogin.getTime() > oldDate.getTime());
		});

		it('新規作成', async () => {
			const session = {};
			await controller.auth({ token: 'UNITTEST_NEW_TOKEN' }, session);
			assert.strictEqual(typeof session['user']['id'], 'number');
			assert.notEqual(session['user']['id'], 105);
			assert.strictEqual(session['user']['token'], 'UNITTEST_NEW_TOKEN');

			const player = await Player.findOrFail(session['user']['id']);
			assert(player.lastLogin.getTime() > oldDate.getTime());
		});
	});
});
