/**
 * 管理者ログアウトコンポーネントのテスト。
 * @module ./app/auth/logout.component.spec
 */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import testHelper from '../../test-helper';

import { LogoutComponent } from './logout.component';
import { AuthService } from './auth.service';

describe('LogoutComponent', () => {
	let fixture: ComponentFixture<LogoutComponent>;

	beforeEach(() => {
		const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
		authServiceSpy.logout.and.returnValue(Promise.resolve());

		testHelper.configureTestingModule({
			declarations: [LogoutComponent],
		}).overrideComponent(LogoutComponent, {
			set: {
				providers: [
					{ provide: AuthService, useValue: authServiceSpy },
				],
			}
		}).compileComponents();

		fixture = TestBed.createComponent(LogoutComponent);
	});

	it('should succeed logout', fakeAsync(() => {
		const routerSpy = spyOn(TestBed.get(Router), 'navigate');
		fixture.detectChanges();
		tick();
		fixture.detectChanges();
		expect(routerSpy).toHaveBeenCalledWith(['/']);
	}));
});
