/**
 * サイドバーコンポーネントのテスト。
 * @module ./app/layout/sidebar.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
	let fixture: ComponentFixture<SidebarComponent>;
	let element: DebugElement;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [SidebarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(SidebarComponent);
		element = fixture.debugElement;

		fixture.detectChanges();
	}));

	it('should render sidebar', () => {
		expect(element.queryAll(By.css('#sidebar a'))[0].nativeElement.textContent).toEqual('PLAYER_PAGE.LINK');
	});
});
