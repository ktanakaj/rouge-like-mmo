/**
 * サイドバーコンポーネント。
 * @module ./app/layout/sidebar.component
 */
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

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
		private router: Router) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit(): void {
		// 画面移動に応じて現在値選択
		this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe((ev: NavigationEnd) => {
			this.activateNavi(ev.url);
		});
	}

	/**
	 * 選択中のナビをアクティブにする。
	 * @param path 表示中のパス。
	 */
	activateNavi(path: string): void {
		for (let i = 0; i < this.navi.length; i++) {
			for (let j = 0; j < this.navi[i].length; j++) {
				this.navi[i][j].active = this.navi[i][j].path === path;
			}
		}
	}
}
