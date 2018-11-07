/**
 * プレイヤー関連サービスのテスト。
 * @module ./app/player/player.service.spec
 */
import { inject } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
	beforeEach(() => {
		testHelper.configureTestingModule({
			providers: [PlayerService]
		});
	});

	it('should be created', inject([PlayerService], (service: PlayerService) => {
		expect(service).toBeTruthy();
	}));
});
