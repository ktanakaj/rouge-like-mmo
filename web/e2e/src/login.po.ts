/**
 * ログイン画面のページオブジェクト。
 * @module ./login.po
 */
import { browser, by, until, element, ElementFinder } from 'protractor';
import { AppPage } from './app.po';

/**
 * ログイン画面のページオブジェクトクラス。
 */
export class LoginPage extends AppPage {
	async navigateTo(): Promise<void> {
		await browser.get('/login');
	}

	getNameBox(): ElementFinder {
		return element(by.css('#maincontent input[name="name"]'));
	}

	getPasswordBox(): ElementFinder {
		return element(by.css('#maincontent input[name="password"]'));
	}

	getSubmitButton(): ElementFinder {
		return element(by.css('#maincontent button[type="submit"]'));
	}

	async setDefaultUser() {
		// ※ 開発環境用のデフォルトアカウントを設定
		const name = this.getNameBox();
		const password = this.getPasswordBox();
		await name.clear();
		await name.sendKeys('admin');
		await password.clear();
		await password.sendKeys('admin01');
	}

	/**
	 * アプリにログインする。
	 * @returns 処理状態。
	 */
	async login(): Promise<void> {
		// 認証情報が無い場合ログインする
		await this.navigateTo();
		const url = await this.getUrl();
		if (url !== 'http://localhost:4200/login') {
			return;
		}
		await this.setDefaultUser();
		await this.getSubmitButton().click();
		await browser.wait(until.urlIs('http://localhost:4200/'), 20000);
	}
}
