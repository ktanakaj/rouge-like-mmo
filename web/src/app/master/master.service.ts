/**
 * マスタ関連サービスモジュール。
 * @module app/master/master.service
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MasterVersion } from './master-version.model';

/**
 * マスタ関連サービスクラス。
 */
@Injectable()
export class MasterService {
	/**
	 * モジュールをDIしてコンポーネントを生成する。
	 * @param http HTTPモジュール。
	 */
	constructor(private http: HttpClient) { }

	/**
	 * マスタ一覧を取得する。
	 * @returns マスタ情報。
	 */
	findLatestMasters(): Promise<string[]> {
		return this.http.get<string[]>('/api/masters').toPromise();
	}

	/**
	 * マスタを取得する。
	 * @param name マスタ名。
	 * @returns マスタ情報。
	 */
	findLatestMaster(name: string): Promise<object[]> {
		return this.http.get<object[]>(`/api/masters/${name}`).toPromise();
	}

	/**
	 * マスタバージョン一覧を取得する。
	 * @param page ページ番号（先頭ページが1）。
	 * @param max 1ページ辺りの最大件数。
	 * @returns マスタバージョン一覧。
	 */
	findAndCountVersions(page: number, max: number): Promise<{ rows: MasterVersion[], count: number }> {
		const params = new HttpParams()
			.set('page', String(page))
			.set('max', String(max));
		return this.http.get<{ rows: MasterVersion[], count: number }>('/api/admin/masters/', { params }).toPromise();
	}

	/**
	 * マスタバージョンの状態を変更する。
	 * @param id マスタバージョンID。
	 * @param status 新しい状態。
	 * @returns 更新したマスタバージョン。
	 */
	changeStatus(id: number, status: string): Promise<object> {
		return this.http.put<object>(`/api/admin/masters/${id}`, { status }).toPromise();
	}

	/**
	 * マスタバージョンに注記を登録する。
	 * @param id マスタバージョンID。
	 * @param note 注記。
	 * @returns 更新したマスタバージョン。
	 */
	addNote(id: number, note: string): Promise<object> {
		return this.http.put<object>(`/api/admin/masters/${id}`, { note }).toPromise();
	}
}
