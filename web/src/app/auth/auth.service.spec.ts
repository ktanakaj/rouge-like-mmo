/**
 * 管理者認証関連サービスのテスト。
 * @module ./app/auth/auth.service.spec
 */
import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import testHelper from '../../test-helper';

import { AuthService } from './auth.service';

describe('AuthService', () => {
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [AuthService]
		});

		httpTestingController = TestBed.get(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should login', (done) => {
		inject([AuthService], (service: AuthService) => {
			const mockResult = { id: 1, name: 'admin', role: 'admin' };

			service.login('admin', 'admin01').then((info) => {
				expect(info.id).toEqual(mockResult.id);
				expect(info.name).toEqual(mockResult.name);
				expect(info.role).toEqual(mockResult.role);
				expect(info.isAuthed()).toBeTruthy();
				done();
			}).catch(fail);

			const req = httpTestingController.expectOne({ method: 'POST', url: '/api/admin/administrators/login' });
			req.flush(mockResult);
		})();
	});

	it("shouldn't login when bad request", (done) => {
		inject([AuthService], (service: AuthService) => {
			service.login('admin', 'INVALID').then(fail).catch((e: HttpErrorResponse) => {
				expect(e.status).toEqual(400);
				expect(e.error).toEqual('Bad Request');
				done();
			});

			const req = httpTestingController.expectOne({ method: 'POST', url: '/api/admin/administrators/login' });
			req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
		})();
	});
});
