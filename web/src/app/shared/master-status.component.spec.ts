/**
 * マスタ状態部品コンポーネントのテスト。
 * @module ./app/shared/master-status.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { MasterStatusComponent } from './master-status.component';

describe('MasterStatusComponent', () => {
	let component: MasterStatusComponent;
	let fixture: ComponentFixture<MasterStatusComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [MasterStatusComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MasterStatusComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
