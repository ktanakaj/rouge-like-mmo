/**
 * パスワード変更画面のページオブジェクト。
 * @module ./password.po
 */
import { by, element } from 'protractor';
import { AppPage } from './app.po';

/**
 * パスワード変更画面のページオブジェクトクラス。
 */
export class PasswordPage extends AppPage {
	async navigateByMenu(): Promise<void> {
		const dropdown = element(by.css('#header #navbarNav .dropdown'));
		const toggle = dropdown.element(by.css('a.dropdown-toggle'));
		await toggle.click();
		await dropdown.all(by.xpath(`//a[text()=\"パスワード変更\"]`)).first().click();
		await toggle.click();
	}
}
