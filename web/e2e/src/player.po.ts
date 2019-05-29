/**
 * プレイヤー一覧画面のページオブジェクト。
 * @module ./player.po
 */
import { ListPage } from './list.po';

/**
 * プレイヤー一覧画面のページオブジェクトクラス。
 */
export class PlayerPage extends ListPage {
	async navigateByMenu(): Promise<void> {
		await this.findSideMenuLink('プレイヤー情報').click();
	}
}
