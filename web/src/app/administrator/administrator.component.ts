/**
 * 管理者ページコンポーネント。
 * @module app/administrator/administrator.component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Administrator } from './administrator.model';
import { AdministratorService } from './administrator.service';

/**
 * 管理者ページコンポーネントクラス。
 */
@Component({
	templateUrl: './administrator.component.html',
	styleUrls: ['./administrator.component.css'],
	providers: [
		AdministratorService,
	],
})
export class AdministratorComponent implements OnInit {
	/** 管理者総数 */
	count: number;
	/** 管理者一覧 */
	rows: Administrator[] = null;
	/** 選択中のページ */
	currentPage = 1;
	/** 1ページの表示件数 */
	pageMax = 50;
	/** ページングのページ数の表示最大値 */
	maxSize = 10;
	/** 選択／編集中の管理者情報 */
	admin: Administrator;
	/** 選択／編集中か？ */
	editEnable = false;

	/** 管理者編集モーダル */
	@ViewChild('editModal') public editModal: ModalDirective;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param administratorService 管理者関連サービス。
	 */
	constructor(
		private administratorService: AdministratorService) {
	}

	/**
	 * コンポーネント起動時の処理。
	 * @returns 処理状態。
	 */
	async ngOnInit(): Promise<void> {
		// 管理者一覧を読み込む
		await this.load(this.currentPage);
	}

	/**
	 * 管理者一覧を検索する。
	 * @param page ページ番号。
	 * @returns 処理状態。
	 */
	async load(page: number): Promise<void> {
		const info = await this.administratorService.findAndCount(page, this.pageMax);
		this.count = info.count;
		this.rows = info.rows;
	}

	/**
	 * 管理者作成／編集を開く。
	 * @param admin 編集する管理者。未指定時は新規作成。
	 */
	openEdit(admin?: Administrator): void {
		this.admin = admin;
		this.editEnable = true;
		this.editModal.show();
	}

	/**
	 * 管理者編集を閉じる。
	 * @param updated 更新があった場合true。
	 * @returns 処理状態。
	 */
	async closeEdit(updated?: boolean): Promise<void> {
		this.editModal.hide();
		this.admin = null;
		this.editEnable = false;
		if (updated) {
			await this.load(this.currentPage);
		}
	}
}
