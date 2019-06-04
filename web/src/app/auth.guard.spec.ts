/**
 * 認証アクセス制御のテスト。
 * @module ./app/auth.guard.spec
 */
import { AuthInfo } from './shared/common.model';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	it('should check authorization success', async () => {
		const auth = new AuthInfo();
		auth.id = 1;
		const guard = new AuthGuard(<any>{
			navigate: () => Promise.resolve(),
		}, auth);

		const result = await guard.canActivate(<any>{}, <any>{});
		expect(result).toEqual(true);
	});

	it('should check authorization failed', async () => {
		const guard = new AuthGuard(<any>{
			navigate: () => Promise.resolve(),
		}, new AuthInfo());

		const result = await guard.canActivate(<any>{}, <any>{});
		expect(result).toEqual(false);
	});
});
