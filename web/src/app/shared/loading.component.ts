/**
 * 読み込み中部品コンポーネント。
 * @module ./app/shared/loading.component
 */
import { Component } from '@angular/core';

/**
 * 読み込み中部品コンポーネントクラス。
 *
 * ローディング中のアニメーションとメッセージを表示する。
 *
 * 例）
 * <app-loading *ngIf="rows === null"></app-loading>
 */
@Component({
	selector: 'app-loading',
	template: '<div class="d-flex align-items-center">'
		+ '<div class="spinner-border" role="status" aria-hidden="true"></div>'
		+ '<span class="ml-2">{{ "LOADING" | translate }}</span>'
		+ '</div>',
})
export class LoadingComponent { }
