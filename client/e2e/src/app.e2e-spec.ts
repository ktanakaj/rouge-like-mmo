/**
 * 「ローグライクなMMOブラウザゲーム」e2eテスト。
 * @module ./app.e2e-spec
 */
import { AppPage } from './app.po';

describe('ローグライクなMMOブラウザゲーム', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display top page', () => {
		page.navigateTo();
		expect(page.getHeaderTitle()).toEqual('ローグライクなMMOブラウザゲーム');
	});
});
