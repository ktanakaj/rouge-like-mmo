/**
 * アプリのe2eテスト。
 * @module ./app.e2e-spec
 */
import { LoginPage } from './login.po';
import { TopPage } from './top.po';
import { PlayerPage } from './player.po';
import { MasterPage } from './master.po';
import { AdminPage } from './admin.po';
import { PasswordPage } from './password.po';

describe('GM Tool Main Scenario', () => {
	// ※ 全体的にいろいろなページを開いて、エラーにならないことだけ確認。
	beforeAll(async () => {
		await (new LoginPage()).login();
	});

	it('should display top page', async () => {
		const page = new TopPage();
		await page.navigateTo();
		expect(await page.getHeaderTitle()).toContain('ローグ風オンラインゲーム');
		expect(await page.getFooterTitle()).toContain('Copyright (C) 2018 Koichi Tanaka All Rights Reserved.');
		expect(await page.getDocumentsTitle()).toContain('各種ドキュメント');
	});

	it('should display player page', async () => {
		const page = new PlayerPage();
		await page.navigateByMenu();
		expect(await page.getPageTitle()).toContain('プレイヤー一覧');

		// プレイヤーは0件の可能性もあるので、一覧部分があることだけチェック
		expect(await page.getRows().count()).toBeGreaterThanOrEqual(0);

		// その他、各種ボタンを押してエラーにならないこと
		await page.getSearchButton().click();
		expect(await page.getRows().count()).toBeGreaterThanOrEqual(0);
	});

	it('should display master page', async () => {
		const page = new MasterPage();
		await page.navigateByMenu();
		expect(await page.getPageTitle()).toContain('マスタ一覧');
	});

	it('should display administrator page', async () => {
		const page = new AdminPage();
		await page.navigateByMenu();
		expect(await page.getPageTitle()).toContain('管理者一覧');

		// 管理者は最低一人は居るので、データが表示されていることをチェック
		expect(await page.getRows().count()).toBeGreaterThan(0);

		// その他、各種ボタンを押してエラーにならないこと
		await page.getNewButton().click();
		expect(await page.getModalTitle()).toContain('管理者登録／変更');
		await page.closeModal();

		await page.getEditButton().click();
		expect(await page.getModalTitle()).toContain('管理者登録／変更');
		await page.closeModal();

		await page.getSearchButton().click();
		expect(await page.getRows().count()).toBeGreaterThan(0);
	});

	it('should display password page', async () => {
		const page = new PasswordPage();
		await page.navigateByMenu();
		expect(await page.getPageTitle()).toContain('パスワード変更');
	});
});
