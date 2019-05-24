/**
 * マスタバージョンページコンポーネント。
 * @module app/master/master-version.component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from '@ngx-translate/core';
import routingHelper from '../core/routing-helper';
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
	rows: MasterVersion[] = null;
	/** ページングのページ数の表示最大値 */
	maxSize = 10;
	/** 現在の検索条件 */
	current: { page: number, max: number } = { page: 1, max: 30 };
	/** 画面ロック中か？ */
	isLocked = false;
	/** 選択／編集中のマスタバージョン情報 */
	version: MasterVersion;

	/** コメント追記モーダル */
	@ViewChild('noteModal') public noteModal: ModalDirective;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 * @param router ルーター。
	 * @param translate 言語リソース関連サービス。
	 * @param masterService マスタ関連サービス。
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private masterService: MasterService) {
	}

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit(): void {
		// クエリーパラメータを条件として画面を読み込む
		this.route.queryParamMap.subscribe(async (params: ParamMap) => {
			this.current.page = routingHelper.getQueryParamAsNumber(params, 'page', 1);
			await this.load();
		});
	}

	/**
	 * マスタバージョン一覧を読み込む。
	 * @returns 処理状態。
	 */
	async load(): Promise<void> {
		this.isLocked = true;
		try {
			const info = await this.masterService.findAndCountVersions(this.current.page, this.current.max);
			this.count = info.count;
			this.rows = info.rows;
		} finally {
			this.isLocked = false;
		}
	}

	/**
	 * マスタバージョン一覧のページを更新する。
	 * @param page ページ番号。
	 * @returns 処理状態。
	 */
	async onPageChanged(page: number): Promise<void> {
		// クエリーパラメータを更新して再読み込みさせる
		await this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
	}

	/**
	 * マスタバージョンの状態を変更する。
	 * @param id マスタバージョンID。
	 * @param status 新しい状態。
	 * @returns 処理状態。
	 */
	async changeStatus(id: number, status: string): Promise<void> {
		this.isLocked = true;
		try {
			const confirm = await this.translate.get('MASTER_VERSION_PAGE.CHANGE_' + status.toUpperCase() + '_BODY', { id }).toPromise();
			if (window.confirm(confirm)) {
				await this.masterService.changeStatus(id, status);
				await this.load();
			}
		} finally {
			this.isLocked = false;
		}
	}

	/**
	 * コメント追記を開く。
	 * @param row 編集するマスタバージョン。
	 */
	showNote(row: MasterVersion): void {
		this.version = Object.assign({}, row);
		this.noteModal.show();
	}

	/**
	 * コメント追記クローズイベント。
	 */
	onHide(): void {
		this.version = null;
	}

	/**
	 * コメントを追記する。
	 * @returns 処理状態。
	 */
	async addNote(): Promise<void> {
		this.isLocked = true;
		try {
			await this.masterService.addNote(this.version.id, this.version.note);
			await this.load();
			this.noteModal.hide();
		} finally {
			this.isLocked = false;
		}
	}
}
