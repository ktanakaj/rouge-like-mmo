/**
 * 管理者関連サービスモジュール。
 * @module app/administrator/administrator.service
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as _ from 'lodash';
import { Administrator } from './administrator.model';

/**
 * 管理者関連サービスクラス。
 */
@Injectable({
	providedIn: 'root'
})
export class AdministratorService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: HttpClient) { }

	/**
	 * 管理者一覧を取得する。
	 * @param page ページ番号（先頭ページが1）。
	 * @param max 1ページ辺りの最大件数。
	 * @returns 管理者一覧。
	 */
	findAndCount(page: number, max: number): Promise<{ rows: Administrator[], count: number }> {
		const params = new HttpParams()
			.set('page', String(page))
			.set('max', String(max));
		return this.http.get<{ rows: Administrator[], count: number }>('/api/admin/administrators/', { params }).toPromise();
	}

	/**
	 * 管理者情報を登録する。
	 * @param administrator 管理者情報。
	 * @returns 登録した管理者情報。
	 */
	save(administrator: Administrator): Promise<Administrator> {
		const body = _.pick(administrator, ['name', 'role', 'note']);
		if (administrator.id) {
			return this.http.put<Administrator>(`/api/admin/administrators/${administrator.id}`, body).toPromise();
		} else {
			return this.http.post<Administrator>('/api/admin/administrators/', body).toPromise();
		}
	}

	/**
	 * 管理者を削除する。
	 * @param id 管理者ID。
	 * @returns 削除した管理者情報。
	 */
	delete(id: number): Promise<Administrator> {
		return this.http.delete<Administrator>(`/api/admin/administrators/${id}`, {}).toPromise();
	}

	/**
	 * 管理者のパスワードをリセットする。
	 * @param id 管理者ID。
	 * @returns 更新した管理者情報。
	 */
	resetPassword(id: number): Promise<Administrator> {
		return this.http.post<Administrator>(`/api/admin/administrators/${id}/reset`, {}).toPromise();
	}
}
