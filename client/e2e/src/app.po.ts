/**
 * 「無を掴め」ページオブジェクト。
 * @module ./app.po
 */
import { browser, by, element } from 'protractor';

/**
 * 「無を掴め」ページクラス。
 */
export class AppPage {
	navigateTo() {
		return browser.get('/');
	}

	getHeaderTitle() {
		return element(by.css('header .navbar-brand')).getText();
	}
}
