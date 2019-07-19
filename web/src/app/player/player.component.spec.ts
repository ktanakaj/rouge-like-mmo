/**
 * プレイヤーページコンポーネントのテスト。
 * @module ./app/player/player.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { PlayerComponent } from './player.component';
import { PlayerService } from './player.service';

describe('PlayerComponent', () => {
	let fixture: ComponentFixture<PlayerComponent>;
	let element: DebugElement;

	beforeEach(async(async () => {
		const playerServiceSpy = jasmine.createSpyObj<PlayerService>('PlayerService', ['findAndCountPlayers']);
		playerServiceSpy.findAndCountPlayers.and.returnValue(Promise.resolve({
			rows: [
				{
					id: 1, level: 10, gameCoins: 100, lastLogin: '2019-07-18T16:10:10Z',
					createdAt: '2019-07-18T15:10:10Z', updatedAt: '2019-07-18T16:10:10Z',
				},
			],
			count: 1,
		}));

		testHelper.configureTestingModule({
			declarations: [PlayerComponent],
		}).overrideComponent(PlayerComponent, {
			set: {
				providers: [
					{ provide: PlayerService, useValue: playerServiceSpy },
				],
			},
		}).compileComponents();

		fixture = TestBed.createComponent(PlayerComponent);
		element = fixture.debugElement;

		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	}));

	it('should render rows', () => {
		// モックのデータが表示されていること
		const row = element.queryAll(By.css('table tbody tr'))[0].queryAll(By.css('td'));
		expect(row[0].nativeElement.textContent).toEqual('1');
		expect(row[1].nativeElement.textContent).toEqual('10');
		expect(row[2].nativeElement.textContent).toEqual('100');
		// ※ ユニットテストはロケールが効かない（？）ため、日付のフォーマットは想定と異なる
		expect(row[3].nativeElement.textContent).toEqual('7/19/19, 1:10 AM');
		expect(row[4].nativeElement.textContent).toEqual('7/19/19, 12:10 AM');
		expect(row[5].nativeElement.textContent).toEqual('7/19/19, 1:10 AM');
	});
});
