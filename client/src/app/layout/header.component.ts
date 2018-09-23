/**
 * ヘッダーコンポーネント。
 * @module ./app/layout/header.component
 */
import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

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
	 * @param authService 認証サービス。※テンプレート内で参照
	 */
	constructor(
		private authService: AuthService
	) { }
}
