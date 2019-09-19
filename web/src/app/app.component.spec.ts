/**
 * アプリのルートコンポーネントのテスト。
 * @module ./app/app.component.spec
 */
import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../test-helper';

import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let element: DebugElement;

	beforeEach(fakeAsync(() => {
		testHelper.configureTestingModule({
			declarations: [
				HeaderComponent,
				FooterComponent,
				SidebarComponent,
				AppComponent,
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		element = fixture.debugElement;

		component.auth.clear();
		fixture.detectChanges();
		tick();
		fixture.detectChanges();
	}));

	it('should render page', fakeAsync(() => {
		// 各要素が表示されていること（ルーター部分は表示されないのでそれ以外）
		// ※ AppComponentだけは、内部でTranslateServiceなどの初期化も行っているので、言語化されたリソースが取れる
		//    （ただし、Karmaの都合？なのか英語扱いになっている）
		expect(element.query(By.css('#header .navbar-brand')).nativeElement.textContent).toContain('Rouge-like MMO');
		expect(element.query(By.css('#footer')).nativeElement.textContent).toContain('Copyright (C) 2018 Koichi Tanaka All Rights Reserved.');

		// サイドバーは表示されない事
		expect(element.query(By.css('#sidebar'))).toBeNull();

		// 認証済みになるとサイドバーが出現すること
		component.auth.id = 1;
		fixture.detectChanges();
		expect(element.query(By.css('#sidebar'))).not.toBeNull();
	}));
});
