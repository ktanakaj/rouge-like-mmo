/**
 * サイドバーコンポーネント。
 * @module ./app/layout/header.component
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

/**
 * サイドバーコンポーネントクラス。
 */
@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
	/** ナビ定義 */
	navi: { title: string, path: string, active?: boolean }[][] = [
		[
			{
				title: 'PLAYER_PAGE.LINK',
				path: '/players',
			},
		],
		[
			{
				title: 'MASTER_VERSION_PAGE.LINK',
				path: '/masters',
			},
			{
				title: 'MASTER_VIEWER_PAGE.LINK',
				path: '/masters/latest',
			},
		],
		[
			{
				title: 'ADMINISTRATOR_PAGE.LINK',
				path: '/admin',
			},
		],
	];

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param route ルート情報。
	 */
	constructor(
		private route: ActivatedRoute) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit(): void {
		// 画面移動に応じて現在値選択
		this.route.url.subscribe(async (url: UrlSegment[]) => {
			this.activateNavi(url);
		});
	}

	/**
	 * 選択中のナビをアクティブにする。
	 * @param url 表示中のURL。
	 */
	activateNavi(url: UrlSegment[]): void {
		let path = '/';
		if (url.length > 0) {
			path += url[0].path;
		}
		for (let i = 0; i < this.navi.length; i++) {
			for (let j = 0; j < this.navi[i].length; j++) {
				this.navi[i][j].active = this.navi[i][j].path === path;
			}
		}
	}
}
