/**
 * マスタバージョンページコンポーネントのテスト。
 * @module ./app/master/master-version.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';
import { MasterStatusComponent } from '../shared/master-status.component';

import { MasterVersionComponent } from './master-version.component';

describe('MasterVersionComponent', () => {
	let component: MasterVersionComponent;
	let fixture: ComponentFixture<MasterVersionComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [
				MasterStatusComponent,
				MasterVersionComponent,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterVersionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
