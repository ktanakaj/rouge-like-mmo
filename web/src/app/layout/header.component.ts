/**
 * ヘッダーコンポーネント。
 * @module ./app/layout/header.component
 */
import { Component } from '@angular/core';
import { AuthInfo } from '../shared/common.model';

/**
 * ヘッダーコンポーネントクラス。
 */
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent {
	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param auth 認証情報。※テンプレート内で参照
	 */
	constructor(
		public auth: AuthInfo
	) { }
}
