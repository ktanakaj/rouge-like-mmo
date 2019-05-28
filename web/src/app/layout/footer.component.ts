/**
 * フッターコンポーネント。
 * @module ./app/layout/footer.component
 */
import { Component } from '@angular/core';
import { environment } from '../../environments/environment';
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
	/** アプリの対応言語 */
	get languages() {
		return environment.languages;
	}
	/** ユーザーの現在の言語 */
	get userlang() {
		return localeHelper.getLanguage();
	}
}
