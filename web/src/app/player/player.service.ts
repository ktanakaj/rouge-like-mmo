/**
 * プレイヤー関連サービスモジュール。
 * @module app/player/player.service
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Player } from './player.model';

/**
 * プレイヤー関連サービスクラス。
 */
@Injectable({
	providedIn: 'root'
})
export class PlayerService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: HttpClient) { }

	/**
	 * プレイヤー一覧を取得する。
	 * @param page ページ番号（先頭ページが1）。
	 * @param max 1ページ辺りの最大件数。
	 * @returns プレイヤー一覧。
	 */
	findAndCountPlayers(page: number, max: number): Promise<{ rows: Player[], count: number }> {
		const params = new HttpParams()
			.set('page', String(page))
			.set('max', String(max));
		return this.http.get<{ rows: Player[], count: number }>('/api/admin/players/', { params })
			.retry(environment.maxRetry)
			.toPromise();
	}
}
