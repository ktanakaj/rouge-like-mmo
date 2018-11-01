/**
 * パスワード変更コンポーネントのテスト。
 * @module ./app/auth/password.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { PasswordComponent } from './password.component';

describe('PasswordComponent', () => {
	let component: PasswordComponent;
	let fixture: ComponentFixture<PasswordComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [PasswordComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PasswordComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
