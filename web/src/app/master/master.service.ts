/**
 * マスタ関連サービスモジュール。
 * @module app/master/master.service
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
	findMasters(): Promise<string[]> {
		return this.http.get<string[]>('/api/masters').toPromise();
	}

	/**
	 * マスタを取得する。
	 * @param name マスタ名。
	 * @returns マスタ情報。
	 */
	findMaster(name: string): Promise<object[]> {
		return this.http.get<object[]>(`/api/masters/${name}`).toPromise();
	}
}
