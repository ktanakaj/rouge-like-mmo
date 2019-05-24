/**
 * 管理者ページコンポーネント。
 * @module app/administrator/administrator.component
 */
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import routingHelper from '../core/routing-helper';
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
	/** ページングのページ数の表示最大値 */
	maxSize = 10;
	/** 現在の検索条件 */
	current: { page: number, max: number } = { page: 1, max: 40 };
	/** 画面ロック中か？ */
	isLocked = true;
	/** 選択／編集中の管理者情報 */
	admin: Administrator;

	/** 管理者編集モーダル */
	@ViewChild('editModal') public editModal: ModalDirective;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 * @param router ルーター。
	 * @param administratorService 管理者関連サービス。
	 */
	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private administratorService: AdministratorService) {
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
	 * 管理者一覧を読み込む。
	 * @returns 処理状態。
	 */
	async load(): Promise<void> {
		this.isLocked = true;
		try {
			const info = await this.administratorService.findAndCount(this.current.page, this.current.max);
			this.count = info.count;
			this.rows = info.rows;
		} finally {
			this.isLocked = false;
		}
	}

	/**
	 * 管理者一覧のページを更新する。
	 * @param page ページ番号。
	 * @returns 処理状態。
	 */
	async onPageChanged(page: number): Promise<void> {
		// クエリーパラメータを更新して再読み込みさせる
		await this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
	}

	/**
	 * 管理者作成／編集を開く。
	 * @param admin 編集する管理者。未指定時は新規作成。
	 */
	showEdit(admin?: Administrator): void {
		this.admin = admin;
		this.editModal.show();
	}

	/**
	 * 管理者編集クローズイベント。
	 */
	onHide(): void {
		this.admin = null;
	}

	/**
	 * 管理者編集完了イベント。
	 * @param updated 更新があった場合true。
	 * @returns 処理状態。
	 */
	async onCompleted(updated?: boolean): Promise<void> {
		this.editModal.hide();
		if (updated) {
			await this.load();
		}
	}
}
