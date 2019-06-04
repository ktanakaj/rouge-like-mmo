/**
 * 管理者ページコンポーネントのテスト。
 * @module ./app/administrator/administrator.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { AdministratorComponent } from './administrator.component';
import { AdministratorEditBodyComponent } from './administrator-edit-body.component';
import { AdministratorService } from './administrator.service';

describe('AdministratorComponent', () => {
	let component: AdministratorComponent;
	let fixture: ComponentFixture<AdministratorComponent>;
	let element: DebugElement;

	beforeEach(async(async () => {
		const administratorServiceSpy = jasmine.createSpyObj<AdministratorService>('AdministratorService', ['findAndCount']);
		administratorServiceSpy.findAndCount.and.returnValue(Promise.resolve({ rows: [{ id: 1, name: 'admin', role: 'admin' }], count: 1 }));

		testHelper.configureTestingModule({
			declarations: [
				AdministratorComponent,
				AdministratorEditBodyComponent,
			],
		}).overrideComponent(AdministratorComponent, {
			set: {
				providers: [
					{ provide: AdministratorService, useValue: administratorServiceSpy },
				],
			},
		}).compileComponents();

		fixture = TestBed.createComponent(AdministratorComponent);
		component = fixture.componentInstance;
		element = fixture.debugElement;

		fixture.detectChanges();
		await fixture.whenStable();
		fixture.detectChanges();
	}));

	it('should render rows', () => {
		// モックのデータが表示されていること
		const row = element.queryAll(By.css('table tbody tr'))[0].queryAll(By.css('td'));
		expect(row[0].nativeElement.textContent).toEqual('1');
		expect(row[1].nativeElement.textContent).toEqual('admin');
		expect(row[2].nativeElement.textContent).toEqual('ADMINISTRATOR.ROLE_ADMIN');
	});

	it('should render modal', () => {
		// 編集モーダルを表示すること
		component.showEdit();
		expect(component.editModal.isShown).toBeTruthy();
	});
});
