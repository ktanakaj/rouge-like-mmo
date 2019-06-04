/**
 * ヘッダーコンポーネントのテスト。
 * @module ./app/layout/header.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
	let fixture: ComponentFixture<HeaderComponent>;
	let element: DebugElement;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [HeaderComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(HeaderComponent);
		element = fixture.debugElement;

		fixture.detectChanges();
	}));

	it('should render navi', () => {
		expect(element.query(By.css('.navbar-brand')).nativeElement.textContent).toContain('APP_NAME');
	});
});
