/**
 * 「ローグライクなMMOブラウザゲーム」認証アクセス制御のテスト。
 * @module ./app/auth.guard.spec
 */
import { async, inject } from '@angular/core/testing';
import testHelper from '../test-helper';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [AuthGuard]
		});
	});

	it('should ...', inject([AuthGuard], (guard: AuthGuard) => {
		expect(guard).toBeTruthy();
	}));

	it('should check authorization success by the `me` API', async () => {
		const guard = new AuthGuard(<any>{
			navigate: () => { },
		}, <any>{
			checkSession: () => true,
		});

		const result = await guard.canActivate(<any>{}, <any>{});
		expect(result).toEqual(true);
	});

	it('should check authorization failed by the `me` API', async () => {
		const guard = new AuthGuard(<any>{
			navigate: () => { },
		}, <any>{
			checkSession: () => false,
		});

		const result = await guard.canActivate(<any>{}, <any>{});
		expect(result).toEqual(false);
	});

	it('should check authorization success by cache', async () => {
		const guard = new AuthGuard(<any>{
			navigate: () => { },
		}, <any>{
			user: {},
			checkSession: () => false,
		});

		const result = await guard.canActivate(<any>{}, <any>{});
		expect(result).toEqual(true);
	});
});
