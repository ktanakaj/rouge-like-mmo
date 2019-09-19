/**
 * フッターコンポーネントのテスト。
 * @module ./app/layout/footer.component.spec
 */
import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
	let fixture: ComponentFixture<FooterComponent>;
	let element: DebugElement;

	beforeEach(fakeAsync(() => {
		testHelper.configureTestingModule({
			declarations: [FooterComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(FooterComponent);
		element = fixture.debugElement;

		fixture.detectChanges();
	}));

	it('should render fotter', () => {
		expect(element.queryAll(By.css('a'))[0].nativeElement.textContent).toEqual('JA');
	});
});
