/**
 * マスタ閲覧画面のページオブジェクト。
 * @module ./master.po
 */
import { ListPage } from './list.po';

/**
 * マスタ閲覧画面のページオブジェクトクラス。
 */
export class MasterPage extends ListPage {
	async navigateByMenu(): Promise<void> {
		await this.findSideMenuLink('マスタ閲覧').click();
	}
}
