/**
 * アプリのe2eテスト。
 * @module ./app.e2e-spec
 */
import { AppPage } from './app.po';

describe('GM Tool', () => {
	let page: AppPage;

	beforeEach(() => {
		page = new AppPage();
	});

	it('should display top page', () => {
		page.navigateTo();
		expect(page.getHeaderTitle()).toEqual('Rouge-like MMO');
	});
});
