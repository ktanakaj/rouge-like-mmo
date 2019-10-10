/**
 * マスタ閲覧ページコンポーネント。
 * @module app/master/master-viewer.component
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MasterService } from './master.service';

/**
 * マスタ閲覧ページコンポーネントクラス。
 */
@Component({
	templateUrl: './master-viewer.component.html',
	styleUrls: ['./master-viewer.component.css'],
	providers: [
		MasterService,
	],
})
export class MasterViewerComponent implements OnInit {
	/** マスタ名一覧 */
	tables: string[] = null;
	/** マスタ名 */
	name = '';
	/** マスタ列名 */
	columns: string[];
	/** マスタデータ一覧 */
	rows: object[] = null;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 * @param masterService マスタ関連サービス。
	 */
	constructor(
		private route: ActivatedRoute,
		private masterService: MasterService) {
	}

	/**
	 * コンポーネント起動時の処理。
	 * @returns 処理状態。
	 */
	async ngOnInit(): Promise<void> {
		this.route.params.subscribe(async (params: Params) => {
			// マスタ名が指定されたらそのマスタを、それ以外の場合は一覧を開く
			this.name = params['name'];
			if (this.name) {
				const rows = await this.masterService.findMaster(this.name);
				this.columns = rows.length > 0 ? Object.keys(rows[0]) : [];
				this.rows = rows;
			} else if (!this.tables) {
				this.tables = await this.masterService.findMasters();
			}
		});
	}
}
