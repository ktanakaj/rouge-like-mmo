/**
 * アプリTOPのページオブジェクト。
 * @module ./top.po
 */
import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

/**
 * アプリTOPのページオブジェクトクラス。
 */
export class TopPage extends AppPage {
	async navigateTo(): Promise<void> {
		await browser.get('/');
	}

	async getDocumentsTitle(): Promise<string> {
		return await element.all(by.css('.card .card-header')).last().getText();
	}
}
