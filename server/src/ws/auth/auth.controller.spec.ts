/**
 * @file auth.controller.tsのテスト。
 */
import * as assert from 'power-assert';
import { TestingModule } from '@nestjs/testing';
import testHelper from '../../test-helper';
import { BadRequestError } from '../../core/errors';
import User from '../../game/shared/user.model';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
	let module: TestingModule;
	let controller: AuthController;

	before(async () => {
		module = await testHelper.createTestingModule({
			controllers: [AuthController],
		}).compile();
		controller = module.get<AuthController>(AuthController);
	});

	describe('#auth()', () => {
		it('認証成功', async () => {
			const conn = { session: {} };
			const result = await controller.auth({ token: 'WS_UNITTEST' }, conn as any);
			assert.deepStrictEqual({ id: 194961981 }, result);

			// DBとセッションも確認する
			const user = await User.findOrFail(result.id);
			// assert(user.updatedAt.getTime() >= Date.now() - 1000);

			assert.strictEqual(conn.session['id'], result.id);
			assert.strictEqual(conn.session['token'], 'WS_UNITTEST');
		});

		it('認証失敗', async () => {
			// トークンが空の場合例外が投げられる
			// TODO: power-assertが対応したら assert.rejects() に変える
			try {
				const conn = { session: {} };
				await controller.auth({ token: '' }, conn as any);
				assert.fail('Missing expected exception');
			} catch (err) {
				assert(err instanceof BadRequestError);
			}
		});
	});
});
