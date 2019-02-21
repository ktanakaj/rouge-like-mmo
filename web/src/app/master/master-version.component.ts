/**
 * マスタバージョンページコンポーネント。
 * @module app/master/master-version.component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import { MasterVersion } from './master-version.model';
import { MasterService } from './master.service';

/**
 * マスタバージョンページコンポーネントクラス。
 */
@Component({
	templateUrl: './master-version.component.html',
	styleUrls: ['./master-version.component.css'],
	providers: [
		MasterService,
	],
})
export class MasterVersionComponent implements OnInit {
	/** マスタバージョン総数 */
	count: number;
	/** マスタバージョン一覧 */
	rows: MasterVersion[];
	/** 選択中のページ */
	currentPage = 1;
	/** 1ページの表示件数 */
	pageMax = 30;
	/** ページングのページ数の表示最大値 */
	maxSize = 10;
	/** ダブルクリック抑止 */
	isButtonClicked = false;
	/** 選択／編集中のマスタバージョン情報 */
	version: MasterVersion;

	/** コメント追記モーダル */
	@ViewChild('noteModal') public noteModal: ModalDirective;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param translate 言語リソース関連サービス。
	 * @param masterService マスタ関連サービス。
	 */
	constructor(
		private translate: TranslateService,
		private masterService: MasterService) {
	}

	/**
	 * コンポーネント起動時の処理。
	 * @returns 処理状態。
	 */
	async ngOnInit(): Promise<void> {
		// マスタバージョン一覧を読み込む
		await this.load(this.currentPage);
	}

	/**
	 * マスタバージョン一覧を検索する。
	 * @param page ページ番号。
	 * @returns 処理状態。
	 */
	async load(page: number): Promise<void> {
		const info = await this.masterService.findAndCountVersions(page, this.pageMax);
		this.count = info.count;
		this.rows = info.rows;
	}

	/**
	 * マスタバージョンの状態を変更する。
	 * @param id マスタバージョンID。
	 * @param status 新しい状態。
	 * @returns 処理状態。
	 */
	async changeStatus(id: number, status: string): Promise<void> {
		this.isButtonClicked = true;
		try {
			const confirm = await this.translate.get('MASTER_VERSION_PAGE.CHANGE_' + status.toUpperCase() + '_BODY', { id }).toPromise();
			if (window.confirm(confirm)) {
				await this.masterService.changeStatus(id, status);
				await this.load(this.currentPage);
			}
		} finally {
			this.isButtonClicked = false;
		}
	}

	/**
	 * コメント追記を開く。
	 * @param row 編集するマスタバージョン。
	 */
	openNote(row: MasterVersion): void {
		this.version = Object.assign({}, row);
		this.noteModal.show();
	}

	/**
	 * コメント追記を閉じる。
	 */
	closeNote(): void {
		this.noteModal.hide();
		this.version = null;
	}

	/**
	 * コメントを追記する。
	 * @returns 処理状態。
	 */
	async addNote(): Promise<void> {
		this.isButtonClicked = true;
		try {
			await this.masterService.addNote(this.version.id, this.version.note);
			await this.load(this.currentPage);
			this.closeNote();
		} finally {
			this.isButtonClicked = false;
		}
	}
}
