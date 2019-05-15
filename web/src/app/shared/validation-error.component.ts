/**
 * バリデーションエラー部品コンポーネント。
 * @module ./app/shared/validation-error.component
 */
import { Component, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

/**
 * バリデーションエラー部品コンポーネントクラス。
 */
@Component({
	selector: 'app-validation-error',
	template: '<div class="warning" *ngIf="value && value.errors">'
		+ '<div [hidden]="!value.errors.required">{{ "VALIDATE.REQUIRED" | translate }}</div>'
		+ '<div [hidden]="!value.errors.min">{{ "VALIDATE.MIN" | translate:{ min: value.errors.min?.value } }}</div>'
		+ '<div [hidden]="!value.errors.max">{{ "VALIDATE.MAX" | translate:{ max: value.errors.max?.value } }}</div>'
		+ '<ng-container *ngIf="value.errors.bsDate">'
		+ '<div [hidden]="!value.errors.bsDate.hasOwnProperty(\'invalid\')">{{ "VALIDATE.DATETIME" | translate }}</div>'
		+ '<div [hidden]="!value.errors.bsDate.minDate">'
		+ '{{ "VALIDATE.MINDATE" | translate:{minDate: value.errors.bsDate.minDate | date:\'short\'} }}</div>'
		+ '<div [hidden]="!value.errors.bsDate.maxDate">'
		+ '{{ "VALIDATE.MAXDATE" | translate:{maxDate: value.errors.bsDate.maxDate | date:\'short\'} }}</div>'
		+ '</ng-container>'
		+ '</div>',
})
export class ValidationErrorComponent {
	/** エラー表示するモデル */
	@Input() value: NgModel;
}
