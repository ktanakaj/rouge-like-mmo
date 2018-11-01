/**
 * マスタ閲覧ページコンポーネントのテスト。
 * @module ./app/master/master-viewer.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { MasterViewerComponent } from './master-viewer.component';

describe('MasterViewerComponent', () => {
	let component: MasterViewerComponent;
	let fixture: ComponentFixture<MasterViewerComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [MasterViewerComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterViewerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
