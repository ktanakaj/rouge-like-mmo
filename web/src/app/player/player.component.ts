/**
 * プレイヤーページコンポーネント。
 * @module app/player/player.component
 */
import { Component, OnInit } from '@angular/core';
import { Player } from './player.model';
import { PlayerService } from './player.service';

/**
 * プレイヤーページコンポーネントクラス。
 */
@Component({
	templateUrl: './player.component.html',
	styleUrls: ['./player.component.css'],
	providers: [
		PlayerService,
	],
})
export class PlayerComponent implements OnInit {
	/** プレイヤー総数 */
	count: number;
	/** プレイヤー一覧 */
	rows: Player[] = null;
	/** 選択中のページ */
	currentPage = 1;
	/** 1ページの表示件数 */
	pageMax = 30;
	/** ページングのページ数の表示最大値 */
	maxSize = 10;

	// TODO: 検索機能とかも含めて大改修する

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param playerService プレイヤー関連サービス。
	 */
	constructor(
		private playerService: PlayerService) {
	}

	/**
	 * コンポーネント起動時の処理。
	 * @returns 処理状態。
	 */
	async ngOnInit(): Promise<void> {
		// プレイヤー一覧を読み込む
		await this.load(this.currentPage);
	}

	/**
	 * プレイヤー一覧を検索する。
	 * @param page ページ番号。
	 * @returns 処理状態。
	 */
	async load(page: number): Promise<void> {
		const info = await this.playerService.findAndCountPlayers(page, this.pageMax);
		this.count = info.count;
		this.rows = info.rows;
	}
}
