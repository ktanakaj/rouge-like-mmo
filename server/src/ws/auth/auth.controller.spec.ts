/**
 * @file auth.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError } from '../../core/errors';
import Player from '../../game/shared/player.model';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
	let module: TestingModule;
	let controller: AuthController;

	before(async () => {
		await Player.create({ id: 100, token: 'WS_UNITTEST_TOKEN100', lastLogin: new Date() });

		module = await testHelper.createTestingModule({
			controllers: [AuthController],
		}).compile();
		controller = module.get<AuthController>(AuthController);
	});

	describe('#auth()', () => {
		it('認証成功', async () => {
			const conn = { session: {} };
			await controller.auth({ token: 'WS_UNITTEST_TOKEN100' }, conn as any);

			// セッションも確認する
			assert.strictEqual(conn.session['id'], 100);
		});

		it('認証失敗', async () => {
			// トークンが不一致の場合例外が投げられる
			// TODO: power-assertが対応したら assert.rejects() に変える
			try {
				const conn = { session: {} };
				await controller.auth({ token: 'INVALID_TOKEN' }, conn as any);
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof BadRequestError);
			}
		});
	});
});
