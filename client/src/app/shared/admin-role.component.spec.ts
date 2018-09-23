/**
 * 管理者ロール部品コンポーネントのテスト。
 * @module ./app/shared/admin-role.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { AdminRoleComponent } from './admin-role.component';

describe('AdminRoleComponent', () => {
	let component: AdminRoleComponent;
	let fixture: ComponentFixture<AdminRoleComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [AdminRoleComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminRoleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
