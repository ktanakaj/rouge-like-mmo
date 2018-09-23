/**
 * サイドバーコンポーネントのテスト。
 * @module ./app/layout/header.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import testHelper from '../../test-helper';

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
	let component: SidebarComponent;
	let fixture: ComponentFixture<SidebarComponent>;
	let translate: TranslateService;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [SidebarComponent],
		}).compileComponents();

		translate = TestBed.get(TranslateService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SidebarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	// it('should render navi', async(() => {
	// 	fixture = TestBed.createComponent(SidebarComponent);
	// 	fixture.detectChanges();
	// 	const compiled = fixture.debugElement.nativeElement;
	// 	translate.get('APP_NAME').toPromise()
	// 		.then((appName) => {
	// 			expect(compiled.querySelector('.navbar-brand').textContent).toEqual(appName);
	// 		});
	// }));
});
