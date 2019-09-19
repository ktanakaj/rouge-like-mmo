/**
 * マスタバージョンページコンポーネントのテスト。
 * @module ./app/master/master-version.component.spec
 */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { MasterVersionComponent } from './master-version.component';
import { MasterService } from './master.service';

describe('MasterVersionComponent', () => {
	let fixture: ComponentFixture<MasterVersionComponent>;
	let element: DebugElement;

	beforeEach(fakeAsync(() => {
		const masterServiceSpy = jasmine.createSpyObj<MasterService>('MasterService', ['findAndCountVersions']);
		masterServiceSpy.findAndCountVersions.and.returnValue(Promise.resolve({
			rows: [{ id: 1, status: 'readied', note: '', createdAt: '2019-07-18T15:10:10Z', updatedAt: '2019-07-18T16:10:10Z' }],
			count: 1,
		}));

		testHelper.configureTestingModule({
			declarations: [
				MasterVersionComponent,
			],
		}).overrideComponent(MasterVersionComponent, {
			set: {
				providers: [
					{ provide: MasterService, useValue: masterServiceSpy },
				],
			},
		}).compileComponents();

		fixture = TestBed.createComponent(MasterVersionComponent);
		element = fixture.debugElement;

		fixture.detectChanges();
		tick();
		fixture.detectChanges();
	}));

	it('should render rows', () => {
		// モックのデータが表示されていること
		const row = element.queryAll(By.css('table tbody tr'))[0].queryAll(By.css('td'));
		expect(row[0].nativeElement.textContent).toEqual('1');
		expect(row[1].nativeElement.textContent).toEqual('MASTER_VERSION.STATUS_READIED');
		expect(row[2].nativeElement.textContent).toEqual('');
		// ※ ユニットテストはロケールが効かない（？）ため、日付のフォーマットは想定と異なる
		expect(row[3].nativeElement.textContent).toEqual('7/19/19, 12:10 AM');
		expect(row[4].nativeElement.textContent).toEqual('7/19/19, 1:10 AM');
	});
});
