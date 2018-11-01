/**
 * 管理者認証関連サービスのテスト。
 * @module ./app/auth/auth.service.spec
 */
import { inject } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { AuthService } from './auth.service';

describe('AuthService', () => {
	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [AuthService]
		});
	});

	it('should be created', inject([AuthService], (service: AuthService) => {
		expect(service).toBeTruthy();
	}));
});
