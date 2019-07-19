/**
 * マスタ閲覧ページコンポーネントのテスト。
 * @module ./app/master/master-viewer.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { MasterViewerComponent } from './master-viewer.component';
import { MasterService } from './master.service';

describe('MasterViewerComponent', () => {
	let fixture: ComponentFixture<MasterViewerComponent>;
	let element: DebugElement;

	beforeEach(async(async () => {
		const masterServiceSpy = jasmine.createSpyObj<MasterService>('MasterService', ['findLatestMasters', 'findLatestMaster']);
		masterServiceSpy.findLatestMasters.and.returnValue(Promise.resolve(['ErrorCodes']));
		masterServiceSpy.findLatestMaster.and.returnValue(Promise.resolve([]));

		testHelper.configureTestingModule({
			declarations: [MasterViewerComponent],
		}).overrideComponent(MasterViewerComponent, {
			set: {
				providers: [
					{ provide: MasterService, useValue: masterServiceSpy },
				],
			},
		}).compileComponents();

		fixture = TestBed.createComponent(MasterViewerComponent);
		element = fixture.debugElement;

		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	}));

	it('should render rows', () => {
		// モックのデータが表示されていること
		const row = element.queryAll(By.css('table tbody tr'))[0].queryAll(By.css('td'));
		expect(row[0].nativeElement.textContent).toEqual('ErrorCodes');
	});
});
