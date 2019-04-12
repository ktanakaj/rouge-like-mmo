/**
 * アプリのルートコンポーネント。
 * @module ./app/app.component
 */
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import localeHelper from './core/locale-helper';
import { AuthInfo } from './shared/common.model';

/**
 * アプリのルートコンポーネントクラス。
 */
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
	/**
	 * サービスをDIしてコンポーネントを生成する。
	 * @param translate 国際化サービス。
	 * @param auth 認証情報。※テンプレート内で参照
	 */
	constructor(
		private translate: TranslateService,
		public auth: AuthInfo) { }

	/**
	 * コンポーネント起動時の処理。
	 */
	ngOnInit(): void {
		// アプリで使用する言語を設定
		// ※ 本当は未対応の言語も設定してよいはずだが、TranslateHttpLoaderの404エラーが出てしまうため、
		//    とりあえず対応している言語のみ許可。
		const lang = localeHelper.getLanguage();
		this.translate.setDefaultLang('ja');
		if (['en', 'ja'].includes(lang)) {
			this.translate.use(lang);
		}
	}
}
