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
		const guard = new AuthGuard({
			navigate: () => Promise.resolve(),
		} as any, auth);

		const result = await guard.canActivate({} as any, {} as any);
		expect(result).toEqual(true);
	});

	it('should check authorization failed', async () => {
		const guard = new AuthGuard({
			navigate: () => Promise.resolve(),
		} as any, new AuthInfo());

		const result = await guard.canActivate({} as any, {} as any);
		expect(result).toEqual(false);
	});
});
