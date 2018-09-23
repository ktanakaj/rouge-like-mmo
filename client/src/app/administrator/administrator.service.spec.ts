/**
 * 管理者関連サービスのテスト。
 * @module ./app/administrator/administrator.service.spec
 */
import { inject } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { AdministratorService } from './administrator.service';

describe('AdministratorService', () => {
	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [AdministratorService]
		});
	});

	it('should be created', inject([AdministratorService], (service: AdministratorService) => {
		expect(service).toBeTruthy();
	}));
});
