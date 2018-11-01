/**
 * 「ローグライクなMMOブラウザゲーム」ページオブジェクト。
 * @module ./app.po
 */
import { browser, by, element } from 'protractor';

/**
 * 「ローグライクなMMOブラウザゲーム」ページクラス。
 */
export class AppPage {
	navigateTo() {
		return browser.get('/');
	}

	getHeaderTitle() {
		return element(by.css('header .navbar-brand')).getText();
	}
}