/**
 * 管理者ロール部品コンポーネント。
 * @module ./app/shared/admin-role.component
 */
import { Component, Input } from '@angular/core';

/**
 * 管理者ロール部品コンポーネントクラス。
 *
 * 管理者ロールを定数値に応じた表示名で表示する。
 *
 * 例）
 * <app-admin-role [role]="admin.role"></app-admin-role>
 */
@Component({
	selector: 'app-admin-role',
	template: '<span [ngSwitch]="role">'
		+ '<span *ngSwitchCase="\'admin\'">{{ "ADMINISTRATOR.ROLE_ADMIN" | translate }}</span>'
		+ '<span *ngSwitchCase="\'writable\'">{{ "ADMINISTRATOR.ROLE_WRITABLE" | translate }}</span>'
		+ '<span *ngSwitchCase="\'readonly\'">{{ "ADMINISTRATOR.ROLE_READONLY" | translate }}</span>'
		+ '<span *ngSwitchDefault>{{ role }}</span>'
		+ '</span>',
})
export class AdminRoleComponent {
	/** ロール */
	@Input() role = '';
}
