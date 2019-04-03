/**
 * アプリのルートコンポーネント。
 * @module ./app/app.component
 */
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import localeHelper from './core/locale-helper';
import { AuthService } from './auth/auth.service';

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
	 * @param authService 認証サービス。※テンプレート内で参照
	 */
	constructor(
		private translate: TranslateService,
		public authService: AuthService) { }

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
