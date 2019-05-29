/**
 * 一覧ページ共通の抽象ページオブジェクト。
 * @module ./list.po
 */
import { by, element, ElementFinder, ElementArrayFinder } from 'protractor';
import { AppPage } from './app.po';

/**
 * 一覧ページ共通の抽象ページオブジェクトクラス。
 */
export abstract class ListPage extends AppPage {
	/**
	 * 「検索」or「更新」ボタンを取得する。
	 * @returns ボタン。
	 */
	getSearchButton(): ElementFinder {
		// ※ 「検索」ボタンと「更新」ボタンはそれぞれどちらかがある想定なので、ある方を取る。
		return element(by.id('maincontent')).all(by.xpath(`//button[text()=\"検索\" or text()=\"更新\"]`)).first();
	}

	/**
	 * 「新規」ボタンを取得する。
	 * @returns ボタン。
	 */
	getNewButton(): ElementFinder {
		return element(by.id('maincontent')).all(by.xpath(`//button[text()=\"新規\"]`)).first();
	}

	/**
	 * 一覧のテーブルを取得する。
	 * @returns テーブル。
	 */
	getTable(): ElementFinder {
		// ※ 一覧の表は一つだけ存在する想定。複数あるページでは要調整。
		return element.all(by.css('#maincontent table')).first();
	}

	/**
	 * 一覧のデータ行の配列を取得する。
	 * @returns 行の配列。
	 */
	getRows(): ElementArrayFinder {
		return this.getTable().all(by.css('tbody tr'));
	}

	/**
	 * 「編集」ボタンを取得する。
	 * @returns 最初に見つけた編集ボタン。
	 */
	getEditButton(): ElementFinder {
		return this.getRows().all(by.xpath(`//button[text()=\"編集\"]`)).first();
	}
}
