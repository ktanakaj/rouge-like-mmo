/**
 * パスワード変更コンポーネントのテスト。
 * @module ./app/auth/password.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import testHelper from '../../test-helper';

import { PasswordComponent } from './password.component';
import { AuthService } from './auth.service';

describe('PasswordComponent', () => {
	let component: PasswordComponent;
	let fixture: ComponentFixture<PasswordComponent>;

	beforeEach(async(async () => {
		const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['changePassword']);
		authServiceSpy.changePassword.and.returnValue(Promise.resolve({ isAuthed: true } as any));

		testHelper.configureTestingModule({
			declarations: [PasswordComponent],
		}).overrideComponent(PasswordComponent, {
			set: {
				providers: [
					{ provide: AuthService, useValue: authServiceSpy },
				],
			}
		}).compileComponents();

		fixture = TestBed.createComponent(PasswordComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	}));

	it('should change password', async () => {
		const routerSpy = spyOn(TestBed.get(Router), 'navigate');
		await component.submit();
		expect(routerSpy).toHaveBeenCalledWith(['/']);
	});
});
