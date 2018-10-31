/**
 * トップページコンポーネント。
 * @module ./app/core/header-navi.component
 */
import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * トップページコンポーネントクラス。
 */
@Component({
	templateUrl: './top.component.html',
	styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {
	/** デバッグ表示ON/OFF */
	isDebug = !environment.production;

	/**
	 * サービスをDIしてコンポーネントを生成する。
	 */
	constructor() { }

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit() {
	}
}
