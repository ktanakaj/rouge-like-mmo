/**
 * 管理者編集本体部コンポーネントのテスト。
 * @module ./app/administrator/administrator-edit-body.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { AdministratorEditBodyComponent } from './administrator-edit-body.component';

describe('AdministratorComponent', () => {
	let component: AdministratorEditBodyComponent;
	let fixture: ComponentFixture<AdministratorEditBodyComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [AdministratorEditBodyComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdministratorEditBodyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
