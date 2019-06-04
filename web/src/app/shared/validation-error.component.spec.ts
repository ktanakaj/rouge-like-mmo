/**
 * バリデーションエラー部品コンポーネントのテスト。
 * @module ./app/shared/validation-error.component.spec
 */
import { TestBed, async, ComponentFixture, } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import testHelper from '../../test-helper';

import { ValidationErrorComponent } from './validation-error.component';

describe('ValidationErrorComponent', () => {
	let component: ValidationErrorComponent;
	let fixture: ComponentFixture<ValidationErrorComponent>;
	let element: DebugElement;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [ValidationErrorComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ValidationErrorComponent);
		component = fixture.componentInstance;
		element = fixture.debugElement;
		fixture.detectChanges();
	}));

	it('should render validation message', () => {
		// 入力値に応じてエラーメッセージが表示されること
		expect(element.nativeElement.textContent).toEqual('');

		component.value = {} as any;
		fixture.detectChanges();
		expect(element.nativeElement.textContent).toEqual('');

		component.value = { errors: { required: true } } as any;
		fixture.detectChanges();
		expect(element.nativeElement.textContent).toEqual('VALIDATE.REQUIRED');

		component.value = { errors: { min: { value: 100 } } } as any;
		fixture.detectChanges();
		expect(element.nativeElement.textContent).toEqual('VALIDATE.MIN');

		component.value = { errors: { max: { value: 100 } } } as any;
		fixture.detectChanges();
		expect(element.nativeElement.textContent).toEqual('VALIDATE.MAX');

		component.value = { errors: { bsDate: { invalid: null } } } as any;
		fixture.detectChanges();
		expect(element.nativeElement.textContent).toEqual('VALIDATE.DATETIME');

		component.value = { errors: { bsDate: { minDate: new Date() } } } as any;
		fixture.detectChanges();
		expect(element.nativeElement.textContent).toEqual('VALIDATE.MINDATE');

		component.value = { errors: { bsDate: { maxDate: new Date() } } } as any;
		fixture.detectChanges();
		expect(element.nativeElement.textContent).toEqual('VALIDATE.MAXDATE');
	});
});
