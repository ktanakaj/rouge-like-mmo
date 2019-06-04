/**
 * 管理者関連サービスのテスト。
 * @module ./app/administrator/administrator.service.spec
 */
import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import testHelper from '../../test-helper';

import { AdministratorService } from './administrator.service';

describe('AdministratorService', () => {
	let httpTestingController: HttpTestingController;

	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [AdministratorService]
		});

		httpTestingController = TestBed.get(HttpTestingController);
	});

	afterEach(() => {
		httpTestingController.verify();
	});

	it('should find and count', (done) => {
		inject([AdministratorService], (service: AdministratorService) => {
			const mockResult = { rows: [], count: 0 };

			service.findAndCount(1, 100).then((info) => {
				expect(info).toEqual(mockResult);
				done();
			}).catch(fail);

			const req = httpTestingController.expectOne({ method: 'GET', url: '/api/admin/administrators/?page=1&max=100' });
			req.flush(mockResult);
		})();
	});
});
