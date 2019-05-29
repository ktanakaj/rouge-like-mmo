/**
 * 管理者一覧／編集画面のページオブジェクト。
 * @module ./admin.po
 */
import { ListPage } from './list.po';

/**
 * 管理者一覧／編集画面のページオブジェクトクラス。
 */
export class AdminPage extends ListPage {
	async navigateByMenu(): Promise<void> {
		await this.findSideMenuLink('管理者情報').click();
	}
}
