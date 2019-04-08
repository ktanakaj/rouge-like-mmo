/**
 * 管理者ページコンポーネントのテスト。
 * @module ./app/administrator/administrator.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { AdministratorComponent } from './administrator.component';
import { AdministratorEditBodyComponent } from './administrator-edit-body.component';

describe('AdministratorComponent', () => {
	let component: AdministratorComponent;
	let fixture: ComponentFixture<AdministratorComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [
				AdministratorComponent,
				AdministratorEditBodyComponent,
			],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdministratorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
