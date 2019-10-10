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
			title: 'MASTER_VIEWER_PAGE.LINK',
			path: '/masters',
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
		// TODO: パス構造によっては正しく判定できないので要改善。
		for (const navi of this.navi) {
			if (Array.isArray(navi['items'])) {
				for (const subnavi of navi['items']) {
					subnavi.active = path.startsWith(subnavi.path);
				}
			} else {
				navi['active'] = path.startsWith(navi['path']);
			}
		}
	}
}
