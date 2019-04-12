/**
 * ロール表示制限部品ディレクティブ。
 * @module ./app/shared/if-role.directive
 */
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthInfo } from './common.model';

/**
 * ロール表示制限部品ディレクティブクラス。
 */
@Directive({
	selector: '[appIfRole]',
})
export class IfRoleDirective {
	/** 表示状態。 */
	private hasView = false;

	/**
	 * モジュールをDIしてディレクティブを生成する。
	 * @param templateRef テンプレート参照。
	 * @param viewContainer ビューコンテナ。
	 * @param auth 認証情報。
	 */
	constructor(
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private auth: AuthInfo) { }

	/**
	 * 認証中ユーザーのロールに応じた表示制限を行う。
	 * @param roles 有効なロール。
	 */
	@Input() set appIfRole(roles: string | string[]) {
		const roleArary = Array.isArray(roles) ? roles : [roles];
		if (this.auth.isAuthed() && roleArary.includes(this.auth.role) && !this.hasView) {
			this.viewContainer.createEmbeddedView(this.templateRef);
			this.hasView = true;
		} else if (this.hasView) {
			this.viewContainer.clear();
			this.hasView = false;
		}
	}
}
