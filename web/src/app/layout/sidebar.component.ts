/**
 * サイドバーコンポーネント。
 * @module ./app/layout/sidebar.component
 */
import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

interface NaviItem {
	title: string;
	path: string;
	active?: boolean;
}

interface NaviGroup {
	title: string;
	items: NaviItem[];
}

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
	navi: (NaviItem | NaviGroup)[] = [
		{
			title: 'PLAYER_PAGE.LINK',
			path: '/players',
		},
		{
			title: 'MASTER_PAGE.LINK',
			items: [
				{
					title: 'MASTER_VERSION_PAGE.LINK',
					path: '/masters',
				},
				{
					title: 'MASTER_VIEWER_PAGE.LINK',
					path: '/masters/latest',
				},
			],
		},
		{
			title: 'ADMINISTRATOR_PAGE.LINK',
			path: '/admin',
		},
	];

	/**
	 * サービス等をDIしてコンポーネントを生成する。
	 * @param router ルーター。
	 */
	constructor(
		private router: Router) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit(): void {
		// 初回表示時のナビを選択中にし、以後画面移動に応じて切り替え
		this.activateNavi(this.router.url);
		this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe((ev: NavigationEnd) => {
			this.activateNavi(ev.url);
		});
	}

	/**
	 * 選択中のナビをアクティブにする。
	 * @param path 表示中のパス。
	 */
	activateNavi(path: string): void {
		// ※ さらにIDなどが付くことがあるので前方一致で比較。
		// TODO: マスタ系ページが正しく判定できないので要改善。
		for (let i = 0; i < this.navi.length; i++) {
			if (Array.isArray(this.navi[i]['items'])) {
				for (let j = 0; j < this.navi[i]['items'].length; j++) {
					this.navi[i]['items'][j].active = path.startsWith(this.navi[i]['items'][j].path);
				}
			} else {
				this.navi[i]['active'] = path.startsWith(this.navi[i]['path']);
			}
		}
	}
}
