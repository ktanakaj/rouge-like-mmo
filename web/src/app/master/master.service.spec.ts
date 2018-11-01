/**
 * マスタ関連サービスのテスト。
 * @module ./app/master/master.service.spec
 */
import { inject } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { MasterService } from './master.service';

describe('MasterService', () => {
	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [MasterService]
		});
	});

	it('should be created', inject([MasterService], (service: MasterService) => {
		expect(service).toBeTruthy();
	}));
});
