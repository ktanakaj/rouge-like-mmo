/**
 * 管理者ページコンポーネント。
 * @module app/administrator/administrator.component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
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
	rows: Administrator[];
	/** 選択中のページ */
	currentPage = 1;
	/** 1ページの表示件数 */
	pageMax = 50;
	/** ページングのページ数の表示最大値 */
	maxSize = 10;
	/** ダブルクリック抑止 */
	isButtonClicked = false;
	/** エラーメッセージ */
	error = '';
	/** 選択／編集中の管理者情報 */
	admin: Administrator;

	/** 管理者編集モーダル */
	@ViewChild('editModal') public editModal: ModalDirective;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 * @param translate 言語リソース関連サービス。
	 * @param administratorService 管理者関連サービス。
	 */
	constructor(
		private route: ActivatedRoute,
		private translate: TranslateService,
		private administratorService: AdministratorService) {
	}

	/**
	 * コンポーネント起動時の処理。
	 * @returns 処理状態。
	 */
	async ngOnInit(): Promise<void> {
		// 管理者一覧を読み込む
		await this.load(this.currentPage);

		// パラメータで直接特定の情報を指定可能にする
		this.route.params.subscribe((params: Params) => {
			if (params['id']) {
				this.openEdit(params['id']);
			}
		});
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
	openEdit(admin: Administrator = { name: '', role: 'readonly' }): void {
		this.admin = Object.assign({}, admin);
		this.editModal.show();
	}

	/**
	 * 管理者編集を閉じる。
	 */
	closeEdit(): void {
		this.editModal.hide();
		this.admin = null;
	}

	/**
	 * 管理者を保存する。
	 * @returns 処理状態。
	 */
	async submit(): Promise<void> {
		this.isButtonClicked = true;
		this.error = '';
		try {
			const admin = await this.administratorService.save(this.admin);
			// 新規アカウントの場合、パスワードを通知
			// TODO: できればメール送信などにしたい
			if (!this.admin.id) {
				const msg = await this.translate.get('ADMINISTRATOR_PAGE.REGISTERED', admin).toPromise();
				window.alert(msg);
			}
			await this.load(this.currentPage);
			this.closeEdit();
		} catch (e) {
			if (!(e instanceof HttpErrorResponse) || e.status !== 409) {
				throw e;
			}
			this.error = 'VALIDATE.DUPLICATED';
		} finally {
			this.isButtonClicked = false;
		}
	}

	/**
	 * 管理者を削除する。
	 * @returns 処理状態。
	 */
	async delete(): Promise<void> {
		this.isButtonClicked = true;
		try {
			const confirm = await this.translate.get('DELETE_CONFIRMING.BODY').toPromise();
			if (window.confirm(confirm)) {
				await this.administratorService.delete(this.admin.id);
				await this.load(this.currentPage);
				this.closeEdit();
			}
		} finally {
			this.isButtonClicked = false;
		}
	}

	/**
	 * 管理者のパスワードをリセットする。
	 * @returns 処理状態。
	 */
	async resetPassword(): Promise<void> {
		this.isButtonClicked = true;
		try {
			// TODO: できれば自分でリセットしてメール送信するようにしたい
			const confirm = await this.translate.get('ADMINISTRATOR_PAGE.PASSWORD_RESET_BODY').toPromise();
			if (window.confirm(confirm)) {
				const admin = await this.administratorService.resetPassword(this.admin.id);
				const msg = await this.translate.get('ADMINISTRATOR_PAGE.PASSWORD_RESETED', admin).toPromise();
				window.alert(msg);
			}
		} finally {
			this.isButtonClicked = false;
		}
	}
}
