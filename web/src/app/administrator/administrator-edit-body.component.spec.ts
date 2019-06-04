/**
 * 管理者編集本体部コンポーネントのテスト。
 * @module ./app/administrator/administrator-edit-body.component.spec
 */
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import testHelper from '../../test-helper';

import { AdministratorEditBodyComponent } from './administrator-edit-body.component';
import { AdministratorService } from './administrator.service';

describe('AdministratorEditBodyComponent', () => {
	let component: AdministratorEditBodyComponent;
	let fixture: ComponentFixture<AdministratorEditBodyComponent>;
	let element: DebugElement;

	beforeEach(async(() => {
		const administratorServiceSpy = jasmine.createSpyObj<AdministratorService>('AdministratorService', ['save', 'delete', 'resetPassword']);
		administratorServiceSpy.save.and.returnValue(Promise.resolve({} as any));

		testHelper.configureTestingModule({
			declarations: [AdministratorEditBodyComponent],
		}).overrideComponent(AdministratorEditBodyComponent, {
			set: {
				providers: [
					{ provide: AdministratorService, useValue: administratorServiceSpy },
				],
			},
		}).compileComponents();

		fixture = TestBed.createComponent(AdministratorEditBodyComponent);
		component = fixture.componentInstance;
		element = fixture.debugElement;

		fixture.detectChanges();
	}));

	it('should render new page', () => {
		// データが無い場合、新規登録ページが表示されていること
		const nameBox = element.query(By.css('form input[name="name"]'));
		expect(nameBox.nativeElement.value).toEqual('');
	});

	it('should render edit page', async () => {
		// データがある場合は、編集ページが表示されていること
		component.adminInput = { id: 1, name: 'UNIT TEST', role: 'admin' };
		fixture.detectChanges();
		await fixture.whenStable();
		const nameBox = element.query(By.css('form input[name="name"]'));
		expect(nameBox.nativeElement.value).toEqual('UNIT TEST');
	});

	it('should work submit button', async () => {
		// submitボタンが押せること
		// TODO: データがちゃんと渡っていることとかも確認したい
		const nameBox = element.query(By.css('form input[name="name"]'));
		nameBox.nativeElement.value = 'Inputed name';
		let completed = false;
		component.completed.subscribe((result) => completed = result);
		await component.submit();
		expect(completed).toBeTruthy();
	});
});
