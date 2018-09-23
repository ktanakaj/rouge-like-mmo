/**
 * 「無を掴め」e2eテスト。
 * @module ./app.e2e-spec
 */
import { AppPage } from './app.po';

describe('無を掴め', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display top page', () => {
		page.navigateTo();
		expect(page.getHeaderTitle()).toEqual('無を掴め');
	});
});
