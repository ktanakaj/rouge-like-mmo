/**
 * アプリのルートコンポーネントのテスト。
 * @module ./app/app.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
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

	beforeEach(async(async () => {
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

		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	}));

	it('should render page', () => {
		// 各要素が表示されていること（ルーター部分は表示されないのでそれ以外）
		// ※ AppComponentだけは、内部でTranslateServiceなどの初期化も行っているので、言語化されたリソースが取れる
		expect(element.query(By.css('#header .navbar-brand')).nativeElement.textContent).toContain('ローグ風オンラインゲーム');
		expect(element.query(By.css('#footer')).nativeElement.textContent).toContain('Copyright (C) 2018 Koichi Tanaka All Rights Reserved.');

		// ローディングが終了していること、またサイドバーは表示されない事
		expect(element.query(By.css('#maincontent .spinner-border'))).toBeNull();
		expect(element.query(By.css('#sidebar'))).toBeNull();

		// 認証済みになるとサイドバーが出現すること
		component.auth.id = 1;
		fixture.detectChanges();
		expect(element.query(By.css('#sidebar'))).not.toBeNull();
	});
});
