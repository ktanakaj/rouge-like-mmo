/**
 * マスタバージョン一覧画面のページオブジェクト。
 * @module ./master.po
 */
import { by, ElementFinder } from 'protractor';
import { ListPage } from './list.po';

/**
 * マスタバージョン一覧画面のページオブジェクトクラス。
 */
export class MasterPage extends ListPage {
	async navigateByMenu(): Promise<void> {
		const link = await this.findSideSubMenuLink('マスタ管理', 'マスタバージョン情報');
		await link.click();
	}

	getChangeButton(): ElementFinder {
		// ※ 状態によってボタンの表記が変わるので、ある方を取る。
		return this.getRows().all(by.xpath(`//button[text()=\"公開する\" or text()=\"非公開にする\"]`)).first();
	}

	getAddCommentButton(): ElementFinder {
		return this.getRows().all(by.xpath(`//button[text()=\"コメント付加\"]`)).first();
	}
}
