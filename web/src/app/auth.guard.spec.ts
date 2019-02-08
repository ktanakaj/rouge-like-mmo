/**
 * GM Tool認証アクセス制御のテスト。
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

	it('should check authorization success', async () => {
		const guard = new AuthGuard(<any>{
			navigate: () => { },
		}, <any>{
			user: {},
		});

		const result = await guard.canActivate(<any>{}, <any>{});
		expect(result).toEqual(true);
	});

	it('should check authorization failed', async () => {
		const guard = new AuthGuard(<any>{
			navigate: () => { },
		}, <any>{
			user: null,
		});

		const result = await guard.canActivate(<any>{}, <any>{});
		expect(result).toEqual(false);
	});
});
