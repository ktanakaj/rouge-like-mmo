/**
 * バリデーションエラー部品コンポーネントのテスト。
 * @module ./app/shared/validation-error.component.spec
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import testHelper from '../../test-helper';

import { ValidationErrorComponent } from './validation-error.component';

describe('ValidationErrorComponent', () => {
	let component: ValidationErrorComponent;
	let fixture: ComponentFixture<ValidationErrorComponent>;

	beforeEach(async(() => {
		testHelper.configureTestingModule({
			declarations: [ValidationErrorComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ValidationErrorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
