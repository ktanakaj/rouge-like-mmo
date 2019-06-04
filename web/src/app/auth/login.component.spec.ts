/**
 * 管理者認証コンポーネントのテスト。
 * @module ./app/auth/login.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import testHelper from '../../test-helper';

import { LoginComponent } from './login.component';
import { AuthService } from './auth.service';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let element: DebugElement;

	beforeEach(async(async () => {
		const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'checkSession']);
		authServiceSpy.login.and.returnValue(Promise.resolve({ isAuthed: true } as any));
		authServiceSpy.checkSession.and.returnValue(Promise.resolve(null));

		testHelper.configureTestingModule({
			declarations: [LoginComponent],
		}).overrideComponent(LoginComponent, {
			set: {
				providers: [
					{ provide: AuthService, useValue: authServiceSpy },
				],
			}
		}).compileComponents();

		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		element = fixture.debugElement;

		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	}));

	it('should render page', () => {
		// ローディングが終了していること
		expect(element.query(By.css('h1')).nativeElement.textContent).toContain('LOGIN_PAGE.TITLE');
	});

	it('should succeed login', async () => {
		const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
		await component.submit();
		expect(routerSpy).toHaveBeenCalledWith('/');
	});
});
