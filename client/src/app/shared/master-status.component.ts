/**
 * マスタ状態部品コンポーネント。
 * @module ./app/shared/master-status.component
 */
import { Component, Input } from '@angular/core';

/**
 * マスタ状態部品コンポーネントクラス。
 */
@Component({
	selector: 'app-master-status',
	template: '<span [ngSwitch]="status">'
		+ '<span *ngSwitchCase="\'importing\'">{{ "MASTER_VERSION.STATUS_IMPORTING" | translate }}</span>'
		+ '<span *ngSwitchCase="\'readied\'">{{ "MASTER_VERSION.STATUS_READIED" | translate }}</span>'
		+ '<span *ngSwitchCase="\'failed\'">{{ "MASTER_VERSION.STATUS_FAILED" | translate }}</span>'
		+ '<span *ngSwitchCase="\'published\'">{{ "MASTER_VERSION.STATUS_PUBLISHED" | translate }}</span>'
		+ '<span *ngSwitchDefault>{{ status }}</span>'
		+ '</span>',
})
export class MasterStatusComponent {
	/** 状態 */
	@Input() status = '';
}
