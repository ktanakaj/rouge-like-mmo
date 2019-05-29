/**
 * アプリ共通の抽象ページオブジェクト。
 * @module ./app.po
 */
import { browser, by, element, ElementFinder } from 'protractor';

/**
 * アプリ共通の抽象ページオブジェクトクラス。
 */
export abstract class AppPage {
	// アプリ内のページは全体的に同じスタイルなので、共通的な抽象クラスを提供
	/**
	 * 現在のURLを取得する。
	 * @returns URL。
	 */
	async getUrl(): Promise<string> {
		return await browser.getCurrentUrl();
	}

	/**
	 * ヘッダーのタイトル（アプリ名等）を取得する。
	 * @returns タイトル。
	 */
	async getHeaderTitle(): Promise<string> {
		return await element(by.css('#header .navbar-brand')).getText();
	}

	/**
	 * フッターのタイトル（コピーライト表記等）を取得する。
	 * @returns タイトル。
	 */
	async getFooterTitle(): Promise<string> {
		return await element(by.id('footer')).getText();
	}

	/**
	 * 各ページのタイトル（メインコンテンツのh1タグ）を取得する。
	 * @returns タイトル。
	 */
	async getPageTitle(): Promise<string> {
		return await element(by.css('#maincontent h1')).getText();
	}

	/**
	 * 有効なモーダルを取得する。
	 * @returns モーダルエレメント。
	 */
	getModal(): ElementFinder {
		// ※ モーダルが入れ子になっている場合、一つ目しか取れないので注意
		return element.all(by.css('#maincontent .modal-content')).filter((e) => e.isDisplayed()).first();
	}

	/**
	 * 有効なモーダルのボディを取得する。
	 * @returns モーダルボディエレメント。
	 */
	getModalBody(): ElementFinder {
		return this.getModal().all(by.css('.modal-body')).filter((e) => e.isDisplayed()).first();
	}

	/**
	 * 有効なモーダルのタイトルを取得する。
	 * @returns タイトル。
	 */
	async getModalTitle(): Promise<string> {
		return await this.getModal().all(by.css('.modal-title')).filter((e) => e.isDisplayed()).first().getText();
	}

	/**
	 * 有効なモーダルを×ボタンで閉じる。
	 * @returns 処理状態。
	 */
	async closeModal(): Promise<void> {
		await this.getModal().all(by.css('button.close')).filter((e) => e.isDisplayed()).first().click();
	}

	/**
	 * アラートダイアログをOKする。
	 * @returns 処理状態。
	 */
	async acceptAlert(): Promise<void> {
		await browser.switchTo().alert().accept();
	}

	/**
	 * アラートダイアログをキャンセルする。
	 * @returns 処理状態。
	 */
	async dismissAlert(): Promise<void> {
		await browser.switchTo().alert().dismiss();
	}

	/**
	 * サイドメニューのリンクを取得する。
	 * @param title リンク文字列。
	 * @returns リンクエレメント。
	 */
	protected findSideMenuLink(title: string): ElementFinder {
		return element(by.id('sidebar')).all(by.xpath(`//a[text()=\"${title}\"]`)).first();
	}

	/**
	 * サイドメニューのサブリンクを取得する。
	 * @param parent 親リンク文字列。
	 * @param child 子リンク文字列。
	 * @returns リンクエレメント。
	 */
	protected async findSideSubMenuLink(parent: string, child: string): Promise<ElementFinder> {
		// 親が開いていない場合は開く
		const link = this.findSideMenuLink(child);
		if (!await link.isDisplayed()) {
			await this.findSideMenuLink(parent).click();
			await browser.wait(() => link.isDisplayed(), 10000);
		}
		return link;
	}
}
