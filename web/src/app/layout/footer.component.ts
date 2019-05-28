/**
 * フッターコンポーネント。
 * @module ./app/layout/footer.component
 */
import { Component } from '@angular/core';
import localeHelper from '../core/locale-helper';

/**
 * フッターコンポーネントクラス。
 */
@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.css']
})
export class FooterComponent {
	/** アプリの現在の言語 */
	get lang() {
		return localeHelper.getLanguage();
	}
}
