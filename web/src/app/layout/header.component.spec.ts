/**
 * ヘッダーコンポーネントのテスト。
 * @module ./app/layout/header.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import testHelper from '../../test-helper';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	let translate: TranslateService;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [HeaderComponent],
		}).compileComponents();

		translate = TestBed.get(TranslateService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should render navi', async(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		fixture.detectChanges();
		const compiled = fixture.debugElement.nativeElement;
		translate.get('APP_NAME').toPromise()
			.then((appName) => {
				expect(compiled.querySelector('.navbar-brand').textContent).toEqual(appName);
			});
	}));
});
